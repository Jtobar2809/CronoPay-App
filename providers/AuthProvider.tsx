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
    async function fethSession() {
      const { error, data } = await supabase.auth.getSession()
      if (error) {
        throw error
      }

      if (data.session) {
        setSession(data.session)
      } else {
        router.replace("/")
      }

      setLoading(false)
    }

    fethSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setSession(session)
        setLoading(false)

        if (session) {
          router.replace("/")
        } else {
          router.replace("/")
        }
      },
    )

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    router.replace("/login") // redirige al login
  }

  return (
    <AuthContext.Provider value={{ loading, session, signOut }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
