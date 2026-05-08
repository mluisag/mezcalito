import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"

export function SignInGate() {
  const qc = useQueryClient()
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  const magic = useMutation({
    mutationFn: (e: string) => api.requestMagicLink(e),
    onSuccess: () => setSent(true),
  })
  const guest = useMutation({
    mutationFn: () => api.guest(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-fuchsia-50 dark:from-purple-950/40 dark:via-background dark:to-fuchsia-950/40">
      <main className="mx-auto max-w-md px-6 pt-20">
        <h1 className="text-4xl font-semibold tracking-tight bg-gradient-to-br from-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
          Mezcalito
        </h1>
        <p className="mt-2 text-muted-foreground">
          Capture, compare, and discover the mezcals you love.
        </p>

        <Card className="mt-8 rounded-3xl border-white/40 bg-white/60 backdrop-blur-md shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Sign in</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sent ? (
              <div className="space-y-2 text-sm">
                <p>Check your inbox — we sent a magic link to <span className="font-medium">{email}</span>.</p>
                <button
                  className="text-xs text-muted-foreground underline"
                  onClick={() => {
                    setSent(false)
                    setEmail("")
                    magic.reset()
                  }}
                >
                  Use a different email
                </button>
              </div>
            ) : (
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (email) magic.mutate(email)
                }}
              >
                <Input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={magic.isPending}
                />
                <Button
                  type="submit"
                  disabled={magic.isPending || !email}
                  className="w-full rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"
                >
                  {magic.isPending ? "Sending…" : "Email me a magic link"}
                </Button>
                {magic.error && (
                  <p className="text-xs text-red-600">
                    Could not send the link. Try again in a moment.
                  </p>
                )}
              </form>
            )}

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              <span>or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <Button
              variant="outline"
              className="w-full rounded-2xl"
              onClick={() => guest.mutate()}
              disabled={guest.isPending}
            >
              {guest.isPending ? "Loading…" : "Continue as guest"}
            </Button>
            <p className="text-[11px] leading-snug text-muted-foreground">
              Guest mode keeps your collection on this device only. Add an email
              later to sync across devices.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
