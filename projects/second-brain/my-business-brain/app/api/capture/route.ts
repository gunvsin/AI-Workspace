import { NextResponse } from 'next/server'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { z } from 'zod'

const captureSchema = z.object({
  text: z.string().min(1),
  source: z.string().optional(),
})

const inboxDir = join(process.cwd(), 'brain', 'inbox')

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { text, source = 'web' } = captureSchema.parse(body)

    const date = new Date().toISOString().slice(0, 10)
    const slug = text.slice(0, 50).replace(/[^a-z0-9\s]/gi, '').replace(/\s/g, '-').toLowerCase() || 'capture'
    const filename = `${date}_${source}_${slug}.md`
    const filepath = join(inboxDir, filename)

    const content = `---
source: ${source}
captured: ${new Date().toISOString()}
processed: false
---

${text}`

    mkdirSync(inboxDir, { recursive: true })
    writeFileSync(filepath, content)

    return NextResponse.json({ ok: true, file: filename })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to capture' }, { status: 500 })
  }
}