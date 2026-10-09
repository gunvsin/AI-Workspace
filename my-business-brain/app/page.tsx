'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { ProfileCard } from '@/components/profile/ProfileCard'

interface Profile {
  role: string
  company: string
  industry: string
  goals: string[]
}

interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  pinned: boolean
  createdAt: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [newNote, setNewNote] = useState({ title: '', content: '', tags: '' })
  const [showNoteForm, setShowNoteForm] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      loadData()
    }
  }, [status])

  async function loadData() {
    try {
      const [profileRes, notesRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/notes'),
      ])
      if (profileRes.ok) setProfile(await profileRes.json())
      if (notesRes.ok) setNotes(await notesRes.json())
    } catch (e) {
      console.error('Failed to load data', e)
    } finally {
      setLoading(false)
    }
  }

  async function createNote() {
    if (!newNote.title.trim()) return
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newNote.title,
        content: newNote.content,
        tags: newNote.tags.split(',').map(t => t.trim()).filter(Boolean),
      }),
    })
    if (res.ok) {
      const note = await res.json()
      setNotes([note, ...notes])
      setNewNote({ title: '', content: '', tags: '' })
      setShowNoteForm(false)
    }
  }

  async function deleteNote(id: string) {
    const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' })
    if (res.ok) setNotes(notes.filter(n => n.id !== id))
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-400">Loading…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">My Business Brain</h1>
            <p className="text-sm text-slate-500">
              {session?.user?.name || session?.user?.email}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {session?.user?.image && (
              <img src={session.user.image} alt="" className="w-9 h-9 rounded-full" />
            )}
            <button
              onClick={() => signOut()}
              className="text-sm text-slate-600 hover:text-slate-900 font-medium"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile */}
          <div className="space-y-6">
            <ProfileCard userId={session?.user?.id ?? ''} />

            {/* Quick stats */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Overview</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-slate-900">{notes.length}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Notes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {notes.filter(n => n.pinned).length}
                  </p>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Pinned</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Notes</h2>
              <button
                onClick={() => setShowNoteForm(!showNoteForm)}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                + New Note
              </button>
            </div>

            {showNoteForm && (
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm mb-6">
                <input
                  type="text"
                  placeholder="Title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <textarea
                  placeholder="Content…"
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Tags (comma separated)"
                  value={newNote.tags}
                  onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={createNote}
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowNoteForm(false)}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.map(note => (
                <div
                  key={note.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-slate-900">{note.title}</h3>
                    <div className="flex gap-1">
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="text-slate-400 hover:text-red-500 text-xs"
                      >
                        delete
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-3 line-clamp-3">{note.content}</p>
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-slate-400 mt-3">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}

              {notes.length === 0 && (
                <div className="col-span-full text-center py-12 text-slate-400">
                  <p className="text-lg">No notes yet</p>
                  <p className="text-sm">Create your first note to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}