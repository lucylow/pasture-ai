import { useState, useEffect, useCallback } from 'react'
import { lovable, user as userStore } from '../lib/lovable'

export function useLovableAuth() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = userStore.subscribe(value => {
      setUser(value)
    })
    return () => unsubscribe()
  }, [])

  const signIn = useCallback(async (email, password) => {
    const { user: u, error } = await lovable.auth.signInWithPassword({ email, password })
    if (u) userStore.set(u)
    return { user: u, error }
  }, [])

  const signOut = useCallback(async () => {
    await lovable.auth.signOut()
    userStore.set(null)
  }, [])

  return { user, signIn, signOut }
}
