import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/entities -> { nodes: [...], links: [...] }
// Typed objects (person/budget/blocker/project/topic) + relations.
export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  // All notes with their entities (typed objects)
  const notes = await prisma.note.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      tags: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  // Build nodes: one per note + one per unique tag (as topic)
  const nodes = []
  const links = []
  const tagIndex = new Map()

  notes.forEach((note, i) => {
    nodes.push({
      id: note.id,
      label: note.title,
      kind: note.pinned ? 'project' : 'topic',
      noteId: note.id,
    })

    note.tags.forEach((tag) => {
      if (!tagIndex.has(tag)) {
        tagIndex.set(tag, nodes.length)
        nodes.push({ id: `tag:${tag}`, label: tag, kind: 'topic' })
      }
      links.push({
        source: note.id,
        target: `tag:${tag}`,
        type: 'tagged',
      })
    })
  })

  // Dedupe links
  const seen = new Set()
  const uniqueLinks = links.filter((l) => {
    const key = `${l.source}->${l.target}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  return NextResponse.json({ nodes, links: uniqueLinks })
}
