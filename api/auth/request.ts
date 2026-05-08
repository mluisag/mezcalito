import type { VercelRequest, VercelResponse } from "@vercel/node"
import { db, schema } from "../_lib/db"
import { randomToken } from "../_lib/crypto"
import { sendMagicLink } from "../_lib/email"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TOKEN_TTL_MS = 60 * 60 * 1000 // 1 hour

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).json({ error: "method not allowed" })
  }
  const body = req.body ?? {}
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "invalid email" })
  }

  const token = randomToken()
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS)
  await db.insert(schema.authTokens).values({ email, token, expiresAt })

  const base = process.env.APP_URL ?? "http://localhost:3000"
  const link = `${base}/api/auth/verify?token=${encodeURIComponent(token)}`

  try {
    await sendMagicLink(email, link)
  } catch (err) {
    console.error("Resend send failed", err)
    return res.status(502).json({ error: "could not send email" })
  }

  return res.status(200).json({ ok: true })
}
