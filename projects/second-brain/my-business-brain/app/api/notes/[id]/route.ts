import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { id } = await params

  const note = await prisma.note.update({
    where: { id, userId: (session.user as any).id },
    data: {
      title: body.title,
      content: body.content,
      tags: body.tags,
      pinned: body.pinned,
    },
  })

  return NextResponse.json(note)
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  await prisma.note.delete({
    where: { id, userId: (session.user as any).id },
  })

  return new NextResponse(null, { status: 204 })
}