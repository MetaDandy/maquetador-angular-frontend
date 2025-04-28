import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./use_auth";

export function useFindOneQuery<T>(key: string, baseUrl: string, id: string) {
  const { token } = useAuth();

  return useQuery<T>({
    queryKey: [key, id],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/${id}`,{
        headers: {
          'Authorization' : `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Error al obtener item");
      return res.json();
    },
    enabled: !!id,
  });
}
