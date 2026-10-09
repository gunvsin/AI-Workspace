'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export interface User {
  id: string
  email: string
  name?: string | null
  image?: string | null
}

export function useUser() {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    setIsLoading(false)
    if (session?.user) {
      setUser({
        id: (session.user as any).id ?? '',
        email: session.user.email ?? '',
        name: session.user.name,
        image: session.user.image,
      })
    } else {
      setUser(null)
    }
  }, [session, status])

  return { data: user, isLoading, signIn, signOut, status }
}