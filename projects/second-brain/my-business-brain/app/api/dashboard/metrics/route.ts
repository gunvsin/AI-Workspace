import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/metrics -> [{ id, label, value, delta, up, spark: number[], explain }]
export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const totalNotes = await prisma.note.count({ where: { userId } })
  const recentNotes = await prisma.note.count({
    where: { userId, createdAt: { gte: thirtyDaysAgo } },
  })
  const pinned = await prisma.note.count({
    where: { userId, pinned: true },
  })

  // 12-point series: notes created per day, last 12 days
  const byDay = await prisma.note.groupBy({
    by: ['createdAt'],
    where: { userId, createdAt: { gte: thirtyDaysAgo } },
    _count: { _all: true },
  })
  const days: number[] = Array(12).fill(0)
  for (const row of byDay) {
    const diff = Math.floor(
      (now.getTime() - row.createdAt.getTime()) / (24 * 60 * 60 * 1000)
    )
    const idx = 11 - diff
    if (idx >= 0 && idx < 12) days[idx] += row._count._all
  }

  const lastDay = days[11]
  const prevDay = days[10]
  const deltaPct =
    prevDay > 0 ? (((lastDay - prevDay) / prevDay) * 100).toFixed(1) : '0.0'
  const up = lastDay >= prevDay

  const metrics = [
    {
      id: 'notes',
      label: 'Total notes',
      value: String(totalNotes),
      delta: `${recentNotes} in 30 days`,
      up: true,
      spark: days,
      explain: `${totalNotes} notes captured, ${recentNotes} in the last 30 days. Capture rate: ~${Math.round(
        recentNotes / 4.3
      )} per week. ${recentNotes > totalNotes * 0.3 ? 'High recency — active capture phase.' : 'Steady-state capture.'}`,
    },
    {
      id: 'today',
      label: 'Notes today',
      value: String(lastDay),
      delta: `${up ? '+' : ''}${deltaPct}% vs yesterday`,
      up,
      spark: days,
      explain: `${lastDay} note(s) today vs ${prevDay} yesterday. ${
        up
          ? 'Capture is trending up — momentum is building.'
          : 'Slight dip vs yesterday; normal variance unless it persists 3+ days.'
      }`,
    },
    {
      id: 'pinned',
      label: 'Pinned',
      value: String(pinned),
      delta: `${((pinned / (totalNotes || 1)) * 100).toFixed(0)}% of all`,
      up: true,
      spark: days.map((d) => Math.max(1, d)),
      explain: `${pinned} of ${totalNotes} notes pinned (${(
        (pinned / (totalNotes || 1)) *
        100
      ).toFixed(0)}%). Pinned notes are your working set — review weekly and unpin what is done.`,
    },
  ]

  return NextResponse.json(metrics)
}
