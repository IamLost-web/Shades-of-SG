import { createContext, useContext, useMemo, useState } from 'react'
import { useAuth } from './AuthContext';

const SESSION_STORAGE_KEY = 'shadesOfSgGuestSession'
const SessionContext = createContext(null)

function createGuestSession() {
  return {
    id: crypto.randomUUID(),
    type: 'guest',
    createdAt: new Date().toISOString(),
    triviaScores: [],
    rhythmScores: [],
  }
}

function loadGuestSession() {
  
  const existingSession = localStorage.getItem(SESSION_STORAGE_KEY)

  if (existingSession) {
    return JSON.parse(existingSession)
  }

  const guestSession = createGuestSession()
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(guestSession))
  return guestSession
}

export function SessionProvider({ children }) {
  const { user } = useAuth()

  // ✅ Only create guest session if no logged-in user
  const [session, setSession] = useState(() => {
    if (user) {
      return null 
    }
    return loadGuestSession()
  })

  const value = useMemo(() => ({
    session,
    updateSession(updater) {
      setSession((currentSession) => {
        const nextSession = typeof updater === 'function' ? updater(currentSession) : updater
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession))
        return nextSession
      })
    },
  }), [session])

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}


export function useSession() {
  const context = useContext(SessionContext)

  if (!context) {
    throw new Error('useSession must be used within SessionProvider')
  }

  return context
}
