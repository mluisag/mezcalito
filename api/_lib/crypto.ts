import { createHmac, randomBytes, timingSafeEqual } from "node:crypto"

function secret(): string {
  const s = process.env.SESSION_SECRET
  if (!s) throw new Error("SESSION_SECRET is not set")
  return s
}

/** URL-safe random token (≈43 chars from 32 bytes). */
export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url")
}

/** HMAC-SHA256(value) using SESSION_SECRET, base64url-encoded. */
export function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("base64url")
}

/** Constant-time signature check. */
export function verify(value: string, signature: string): boolean {
  const expected = sign(value)
  const a = Buffer.from(expected)
  const b = Buffer.from(signature)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}
