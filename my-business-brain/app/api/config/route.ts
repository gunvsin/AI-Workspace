import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const brainRoot = join(process.cwd(), 'brain')

function parseConfig(text: string): any {
  const cfg: any = {}
  let current: any = cfg
  const stack: { obj: any; indent: number }[] = []

  for (const line of text.split('\n')) {
    const stripped = line.split('#')[0].trim()
    if (!stripped) continue

    const indent = line.length - line.trimStart().length

    while (stack.length && stack[stack.length - 1].indent >= indent) {
      stack.pop()
    }
    current = stack.length ? stack[stack.length - 1].obj : cfg

    if (stripped.endsWith(':')) {
      const key = stripped.slice(0, -1).trim()
      current[key] = {}
      stack.push({ obj: current[key], indent })
      current = current[key]
    } else {
      const [key, ...rest] = stripped.split(':')
      if (rest.length === 0) continue
      let val: any = rest.join(':').trim()
      if (val === 'true') val = true
      else if (val === 'false') val = false
      else if (!isNaN(Number(val))) val = Number(val)
      current[key.trim()] = val
    }
  }

  return cfg
}

export async function GET() {
  try {
    const cfgPath = join(brainRoot, 'config.yaml')
    const text = readFileSync(cfgPath, 'utf-8')
    return NextResponse.json(parseConfig(text))
  } catch (e) {
    return NextResponse.json({ error: 'Config not found' }, { status: 404 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { yaml } = await import('yaml')
    const text = yaml.stringify(body)
    const cfgPath = join(brainRoot, 'config.yaml')
    writeFileSync(cfgPath, text)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to write config' }, { status: 500 })
  }
}