import { useCallback, useEffect, useState } from "react"

import { fetchUsuarioPerfil, UsuarioPerfilRow } from "../../lib/api/users"

type Options = {
  enabled?: boolean
}

type UseUsuarioPerfilState = {
  data: UsuarioPerfilRow | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

const DEFAULT_STATE: UseUsuarioPerfilState = {
  data: null,
  isLoading: false,
  error: null,
  refetch: async () => {},
}

export function useUsuarioPerfil(
  userId: string | null | undefined,
  options: Options = {},
): UseUsuarioPerfilState {
  const [data, setData] = useState<UsuarioPerfilRow | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const enabled = options.enabled ?? true

  const handleFetch = useCallback(async () => {
    if (!userId || !enabled) return

    try {
      setIsLoading(true)
      setError(null)
      const result = await fetchUsuarioPerfil(userId)
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }, [userId, enabled])

  useEffect(() => {
    handleFetch()
  }, [handleFetch])

  if (!userId || !enabled) {
    return {
      ...DEFAULT_STATE,
      refetch: handleFetch,
    }
  }

  return {
    data,
    isLoading,
    error,
    refetch: handleFetch,
  }
}
