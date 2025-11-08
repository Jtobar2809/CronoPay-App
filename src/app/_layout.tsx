import "@/global.css"
import * as Linking from "expo-linking"
import { router, Slot } from "expo-router"
import React, { useEffect } from "react"

import { createSessionFromUrl } from "@/app/(onboarding)/_layout"

export default function Layout() {
  useEffect(() => {
    const { remove } = Linking.addEventListener(
      "url",
      async (res: { url: string }) => {
        if (res.url) {
          const session = await createSessionFromUrl(res.url)
          if (session) {
            router.replace("/")
          }
        }
      },
    )

    return () => remove()
  }, [])

  return <Slot />
}
