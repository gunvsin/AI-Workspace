import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/notes/[id]/links -> { backlinks: [...], outlinks: [...] }
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params

  const note = await prisma.note.findFirst({
    where: { id, userId: (session.user as any).id },
  })
  if (!note) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const [outlinks, backlinks] = await Promise.all([
    prisma.noteRelation.findMany({
      where: { fromNoteId: id },
      include: { toNote: true },
    }),
    prisma.noteRelation.findMany({
      where: { toNoteId: id },
      include: { fromNote: true },
    }),
  ])

  return NextResponse.json({
    outlinks: outlinks.map((r) => r.toNote),
    backlinks: backlinks.map((r) => r.fromNote),
  })
}

// POST /api/notes/[id]/links { toNoteId } -> link
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const { toNoteId } = await req.json()

  const from = await prisma.note.findFirst({
    where: { id, userId: (session.user as any).id },
  })
  const to = await prisma.note.findFirst({
    where: { id: toNoteId, userId: (session.user as any).id },
  })
  if (!from || !to) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 })
  }

  const link = await prisma.noteRelation.upsert({
    where: {
      fromNoteId_toNoteId_type: {
        fromNoteId: id,
        toNoteId,
        type: 'links',
      },
    },
    create: { fromNoteId: id, toNoteId, type: 'links' },
    update: {},
  })
  return NextResponse.json(link, { status: 201 })
}

// DELETE /api/notes/[id]/links?to=NOTE_ID
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const toNoteId = new URL(req.url).searchParams.get('to')

  const result = await prisma.noteRelation.deleteMany({
    where: {
      fromNoteId: id,
      toNoteId,
      type: 'links',
    },
  })
  return new NextResponse(null, { status: 204 })
}
