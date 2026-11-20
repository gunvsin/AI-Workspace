import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// POST /api/dashboard/explain  { "question": "..." } -> { "answer": "..." }
// Deterministic, data-grounded explainer: no external AI call, no secrets.
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let question = ''
  try {
    const body = await req.json()
    question = String(body.question || '').toLowerCase()
  } catch {
    return NextResponse.json({ error: 'Bad JSON' }, { status: 400 })
  }

  const userId = session.user.id
  const notes = await prisma.note.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  const pinned = notes.filter((n) => n.pinned)
  const total = await prisma.note.count({ where: { userId } })

  const tagCounts = new Map<string, number>()
  for (const n of notes) for (const t of n.tags) {
    tagCounts.set(t, (tagCounts.get(t) || 0) + 1)
  }
  const topTags = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  let answer: string
  if (question.includes('pin') || question.includes('pinned')) {
    answer = pinned.length
      ? `${pinned.length} pinned note(s): ${pinned
          .slice(0, 3)
          .map((n) => `"${n.title}"`)
          .join(', ')}${pinned.length > 3 ? ` (+${pinned.length - 3} more)` : ''}. These form your working set.`
      : 'Nothing pinned yet. Pin the notes you are actively working on.'
  } else if (question.includes('tag') || question.includes('topic')) {
    answer = topTags.length
      ? `Top tags across recent notes: ${topTags
          .map(([t, c]) => `${t} (${c})`)
          .join(', ')}.`
      : 'No tags on recent notes. Add tags during capture for better retrieval.'
  } else if (question.includes('recent') || question.includes('latest')) {
    answer = notes.length
      ? `Latest: ${notes
          .slice(0, 3)
          .map((n) => `"${n.title}"`)
          .join(', ')}${notes.length > 3 ? ` (+${notes.length - 3} more of last 50)` : ''}.`
      : 'No notes captured yet.'
  } else if (question.includes('total') || question.includes('count') || question.includes('how many')) {
    answer = `${total} note(s) total. ${pinned.length} pinned.`
  } else {
    answer = `${total} notes, ${pinned.length} pinned, top tags: ${
      topTags.map(([t]) => t).join(', ') || 'none'
    }. Ask about "pinned", "tags", "recent", or "total" for specifics.`
  }

  return NextResponse.json({ answer })
}
