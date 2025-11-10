import { Session } from "@supabase/supabase-js"
import { router } from "expo-router"
import React, { createContext, useState, useEffect, useContext } from "react"

import { supabase } from "../lib/supabase"

type AuthData = {
  loading: boolean
  session: Session | null
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthData>({
  loading: true,
  session: null,
  signOut: async () => {},
})

interface Props {
  children: React.ReactNode
}

export default function AuthProvider(props: Props) {
  const [loading, setLoading] = useState<boolean>(true)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        setSession(data.session)
      } catch (error) {
        console.error("Error fetching session", error)
        setSession(null)
      } finally {
        setLoading(false)
      }
    }

    fetchSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, authSession) => {
        setSession(authSession)
      },
    )

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Error signing out", error)
    } finally {
      setSession(null)
      router.replace("/")
    }
  }

  return (
    <AuthContext.Provider value={{ loading, session, signOut }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
