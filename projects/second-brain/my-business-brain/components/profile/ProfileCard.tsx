'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export interface ProfileCardProps {
  userId: string
}

export function ProfileCard({ userId }: ProfileCardProps) {
  const { data: session } = useSession()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    role: 'Founder/CEO',
    company: '',
    industry: 'Technology',
    goals: '',
  })

  const handleSave = () => {
    // TODO: save to API
    setEditing(false)
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-900">Profile</h2>
        <button
          onClick={() => setEditing(!editing)}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {session?.user && (
        <div className="flex items-center gap-3 mb-6">
          {session.user.image && (
            <img
              src={session.user.image}
              alt=""
              className="w-12 h-12 rounded-full"
            />
          )}
          <div>
            <p className="font-medium text-slate-900">{session.user.name}</p>
            <p className="text-sm text-slate-500">{session.user.email}</p>
          </div>
        </div>
      )}

      {editing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option>Founder/CEO</option>
              <option>Product Manager</option>
              <option>Engineering Lead</option>
              <option>Designer</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Company</label>
            <input
              type="text"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="Your company name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Industry</label>
            <select
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option>Technology</option>
              <option>Finance</option>
              <option>Healthcare</option>
              <option>Education</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Primary Goals</label>
            <input
              type="text"
              value={form.goals}
              onChange={(e) => setForm({ ...form, goals: e.target.value })}
              placeholder="e.g. Launch MVP, Scale to 100 users"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSave}
            className={cn(
              "w-full py-2.5 px-4 rounded-lg bg-indigo-600 text-white font-medium",
              "hover:bg-indigo-700 transition-colors text-sm"
            )}
          >
            Save Profile
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Role</span>
            <p className="text-sm text-slate-900">{form.role}</p>
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Company</span>
            <p className="text-sm text-slate-900">{form.company || '—'}</p>
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Industry</span>
            <p className="text-sm text-slate-900">{form.industry}</p>
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Goals</span>
            <p className="text-sm text-slate-900">{form.goals || '—'}</p>
          </div>
        </div>
      )}
    </div>
  )
}