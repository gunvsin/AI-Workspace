import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: (session.user as any).id },
  })

  return NextResponse.json(profile || {})
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const userId = (session.user as any).id

  const profile = await prisma.profile.upsert({
    where: { userId },
    create: {
      userId,
      role: body.role,
      company: body.company,
      industry: body.industry,
      goals: body.goals ? [body.goals] : [],
      preferences: body.preferences || {},
    },
    update: {
      role: body.role,
      company: body.company,
      industry: body.industry,
      goals: body.goals ? [body.goals] : [],
      preferences: body.preferences || {},
    },
  })

  return NextResponse.json(profile)
}