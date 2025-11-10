import { useCallback, useEffect, useMemo, useState } from "react"

import { fetchPagos, PagoWithRelations } from "../../lib/api"

type Options = {
  enabled?: boolean
}

type PagosState = {
  data: PagoWithRelations[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

const DEFAULT_STATE: PagosState = {
  data: [],
  isLoading: false,
  error: null,
  refetch: async () => {},
}

export function usePagos(
  userId: string | null | undefined,
  options: Options = {},
): PagosState {
  const [data, setData] = useState<PagoWithRelations[]>([])
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const enabled = useMemo(() => options.enabled ?? true, [options.enabled])

  const handleFetch = useCallback(async () => {
    if (!userId || !enabled) return

    try {
      setIsLoading(true)
      setError(null)
      const result = await fetchPagos(userId)
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
