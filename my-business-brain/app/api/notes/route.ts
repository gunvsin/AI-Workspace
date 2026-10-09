import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const notes = await prisma.note.findMany({
    where: { userId: session.user.id },
    orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
  })

  return NextResponse.json(notes)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()

  const note = await prisma.note.create({
    data: {
      userId: session.user.id,
      title: body.title,
      content: body.content || '',
      tags: body.tags || [],
    },
  })

  return NextResponse.json(note)
}