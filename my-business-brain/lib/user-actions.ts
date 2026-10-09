import { User } from '@/types/prisma'

export interface CreateUserData {
  googleId: string
  email: string
  name?: string | null
  image?: string | null
}

export async function createUser(data: CreateUserData) {
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create user')
  return res.json()
}
