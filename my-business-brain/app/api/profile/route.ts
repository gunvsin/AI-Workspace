import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  })

  return NextResponse.json(profile || {})
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()

  const profile = await prisma.profile.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
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