import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./use_auth";

type MutationConfig<T, R = T> = {
  queryKey: string;
  baseUrl: string;
}

export function useQueryMutation<T extends Record<string, any>>(config: MutationConfig<T>) {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const create = useMutation({
    mutationFn: async (data: Partial<T>) => {
      const res = await fetch(config.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error('Error al crear');

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [config.queryKey],
      });
    }
  });

  const update = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<T> }) => {
      const res = await fetch(`${config.baseUrl}/${id}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Error al actualizar");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [config.queryKey] });
    },
  });

  const soft_delete = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${config.baseUrl}/${id}`,
        {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
      if (!res.ok) throw new Error("Error al eliminar");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [config.queryKey] });
    },
  });

  return { create, update, soft_delete }
}