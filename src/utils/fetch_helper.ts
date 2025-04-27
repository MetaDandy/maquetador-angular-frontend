type FetchHelperOptions<T> = {
  data?: Partial<T>;
  token: string;
  baseUrl: string;
  method?: "POST" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
};

export async function FetchHelper<T>({
  token,
  baseUrl,
  data,
  method = "POST",
  headers = {}
}: FetchHelperOptions<T>) {
  const res = await fetch(baseUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!res.ok) {
    const errorResponse = await res.json();
    console.error('Error en la respuesta:', errorResponse);
    throw new Error(errorResponse);
  }

  return res.json();
}
