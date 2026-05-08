export type CurrentUser = {
  id: string
  email: string | null
  firstName: string | null
  lastName: string | null
  isGuest: boolean
}

export type MeResponse = { user: CurrentUser | null }

async function jsonFetch<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    credentials: "same-origin",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`${res.status} ${res.statusText}: ${text}`)
  }
  return res.json() as Promise<T>
}

export const api = {
  me: () => jsonFetch<MeResponse>("/api/auth/me"),
  requestMagicLink: (email: string) =>
    jsonFetch<{ ok: true }>("/api/auth/request", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  guest: () =>
    jsonFetch<{ user: CurrentUser }>("/api/auth/guest", { method: "POST" }),
  logout: () =>
    jsonFetch<{ ok: true }>("/api/auth/logout", { method: "POST" }),
}
