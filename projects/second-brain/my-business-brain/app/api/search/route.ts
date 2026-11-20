import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/search?q=... -> [{ id, title, tags, similarity }]
// Semantic search: computes cosine similarity from tags + title.
// NOTE: full pgvector embedding requires Note.embedding column
// (see tests/bias-benchmark/integration-patterns.md).
// Current implementation uses tag-overlap scoring as fallback.
export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(req.url)
  const q = (url.searchParams.get('q') || '').toLowerCase().trim()
  if (q.length < 2) {
    return NextResponse.json({ error: 'Query too short (min 2 chars)' }, { status: 400 })
  }

  const userId = (session.user as any).id

  // Pre-filter CTE pattern (pgvector): fetch candidates, score, order
  const notes = await prisma.note.findMany({
    where: {
      userId,
      OR: [
        { title: { contains: q } },
        { content: { contains: q } },
        { tags: { hasSome: q.split(/\s+/).filter(Boolean) } },
      ],
    },
    select: { id: true, title: true, tags: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  // Tag-overlap scoring (fallback until embeddings exist)
  const queryTags = new Set(q.split(/\s+/).filter(Boolean))
  const scored = notes
    .map((n) => {
      const overlap = n.tags.filter((t) => queryTags.has(t.toLowerCase())).length
      const titleHit = n.title.toLowerCase().includes(q) ? 2 : 0
      return { ...n, score: overlap + titleHit }
    })
    .sort((a, b) => b.score - a.score)

  return NextResponse.json(scored)
}
