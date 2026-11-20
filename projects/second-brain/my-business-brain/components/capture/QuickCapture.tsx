'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export function QuickCapture() {
  const [text, setText] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok'>('idle')

  async function submit() {
    if (!text.trim()) return
    setStatus('sending')
    try {
      const res = await fetch('/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, source: 'quick-capture' }),
      })
      if (res.ok) {
        setStatus('ok')
        setText('')
        setTimeout(() => setStatus('idle'), 2000)
      }
    } catch (e) {
      setStatus('idle')
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 mb-6">
      <h3 className="font-semibold text-slate-900 mb-4">Quick Capture</h3>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Type anything — ideas, notes, tasks..."
          className={cn(
            "flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all",
            status === 'sending' && "opacity-50 cursor-not-allowed"
          )}
          disabled={status === 'sending'}
        />
        <button
          onClick={submit}
          disabled={status === 'sending' || !text.trim()}
          className="px-5 py-3 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {status === 'sending' ? '…' : status === 'ok' ? 'Saved!' : 'Capture'}
        </button>
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-slate-400">
        <span>Quick capture writes to brain/inbox/</span>
        <span>•</span>
        <span>Use /ingest to process</span>
      </div>
    </div>
  )
}