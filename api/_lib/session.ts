import type { VercelRequest, VercelResponse } from "@vercel/node"
import { parse, serialize } from "cookie"
import { eq } from "drizzle-orm"
import { db, schema } from "./db"
import { sign, verify } from "./crypto"
import type { User } from "../../shared/schema"

const COOKIE_NAME = "mezcalito_session"
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30 // 30 days

/** Set the session cookie identifying the given user. */
export function setSessionCookie(res: VercelResponse, userId: string): void {
  const value = `${userId}.${sign(userId)}`
  res.setHeader(
    "Set-Cookie",
    serialize(COOKIE_NAME, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: MAX_AGE_SECONDS,
    }),
  )
}

/** Clear the session cookie. */
export function clearSessionCookie(res: VercelResponse): void {
  res.setHeader(
    "Set-Cookie",
    serialize(COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    }),
  )
}

/** Parse the session cookie and return the user id, or null if invalid. */
export function getSessionUserId(req: VercelRequest): string | null {
  const cookies = parse(req.headers.cookie ?? "")
  const raw = cookies[COOKIE_NAME]
  if (!raw) return null
  const [userId, signature] = raw.split(".")
  if (!userId || !signature) return null
  if (!verify(userId, signature)) return null
  return userId
}

/** Look up the current user, or null if no/invalid session. */
export async function getCurrentUser(req: VercelRequest): Promise<User | null> {
  const userId = getSessionUserId(req)
  if (!userId) return null
  const rows = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .limit(1)
  return rows[0] ?? null
}

/** Send 401 and return null when no current user. */
export async function requireUser(
  req: VercelRequest,
  res: VercelResponse,
): Promise<User | null> {
  const user = await getCurrentUser(req)
  if (!user) {
    res.status(401).json({ error: "unauthorized" })
    return null
  }
  return user
}
