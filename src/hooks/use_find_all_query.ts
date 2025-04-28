import { useQuery } from '@tanstack/react-query'
import { FindAll } from '@/types/find_all'
import { useAuth } from './use_auth'

type UseFindAllQueryParams<T> = {
  queryKey:  (string | Record<string, unknown>)[]
  route: string
  pageIndex: number
  pageSize: number
}

export function useFindAllQuery<T>({
  queryKey,
  route,
  pageIndex,
  pageSize,
}: UseFindAllQueryParams<T>) {
  const { token } = useAuth();

  return useQuery<FindAll<T>>({
    queryKey: [queryKey, pageIndex, pageSize],
    queryFn: async () => {
      const res = await fetch(`${route}?page=${pageIndex + 1}&limit=${pageSize}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error('Error al obtener datos')
      return res.json()
    },
    gcTime: 10 * 60 * 1000,
    //keepPreviousData: true,
    placeholderData: (prev) => prev,
  });
}
