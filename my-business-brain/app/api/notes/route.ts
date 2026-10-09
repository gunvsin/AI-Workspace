import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const notes = await prisma.note.findMany({
    where: { userId: (session.user as any).id },
    orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
  })

  return NextResponse.json(notes)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()

  const note = await prisma.note.create({
    data: {
      userId: (session.user as any).id,
      title: body.title,
      content: body.content || '',
      tags: body.tags || [],
    },
  })

  return NextResponse.json(note)
}