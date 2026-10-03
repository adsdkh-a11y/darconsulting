/** Client-side JSON API helper. Throws an Error with the server's message. */
export async function api<T = unknown>(path: string, method = "POST", body?: unknown): Promise<T> {
  const res = await fetch(path, {
    method,
    headers: body instanceof FormData ? undefined : { "content-type": "application/json" },
    body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") window.location.href = "/login";
    throw new Error((data as { error?: string }).error ?? "Request failed");
  }
  return data as T;
}
