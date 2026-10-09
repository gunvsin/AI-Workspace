import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()

  const note = await prisma.note.update({
    where: { id: params.id, userId: session.user.id },
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
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await prisma.note.delete({
    where: { id: params.id, userId: session.user.id },
  })

  return new NextResponse(null, { status: 204 })
}