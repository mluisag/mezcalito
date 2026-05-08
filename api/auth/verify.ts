import type { VercelRequest, VercelResponse } from "@vercel/node"
import { and, eq, isNull, gt } from "drizzle-orm"
import { db, schema } from "../_lib/db"
import { setSessionCookie, getSessionUserId } from "../_lib/session"

function failRedirect(res: VercelResponse, reason: string) {
  const base = process.env.APP_URL ?? "http://localhost:3000"
  res.setHeader("Location", `${base}/?auth=${reason}`)
  return res.status(302).end()
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET")
    return res.status(405).json({ error: "method not allowed" })
  }
  const token = typeof req.query.token === "string" ? req.query.token : ""
  if (!token) return failRedirect(res, "missing-token")

  const now = new Date()
  const [row] = await db
    .select()
    .from(schema.authTokens)
    .where(
      and(
        eq(schema.authTokens.token, token),
        isNull(schema.authTokens.consumedAt),
        gt(schema.authTokens.expiresAt, now),
      ),
    )
    .limit(1)

  if (!row) return failRedirect(res, "invalid-or-expired")

  // Mark token consumed.
  await db
    .update(schema.authTokens)
    .set({ consumedAt: now })
    .where(eq(schema.authTokens.id, row.id))

  // If this browser already has a guest session, claim it for this email.
  // Otherwise find-or-create a user with this email.
  const guestId = getSessionUserId(req)
  let userId: string

  const [existing] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, row.email))
    .limit(1)

  if (existing) {
    userId = existing.id
  } else if (guestId) {
    const [claimed] = await db
      .update(schema.users)
      .set({ email: row.email })
      .where(and(eq(schema.users.id, guestId), isNull(schema.users.email)))
      .returning()
    if (claimed) {
      userId = claimed.id
    } else {
      const [created] = await db
        .insert(schema.users)
        .values({ email: row.email })
        .returning()
      userId = created.id
    }
  } else {
    const [created] = await db
      .insert(schema.users)
      .values({ email: row.email })
      .returning()
    userId = created.id
  }

  setSessionCookie(res, userId)
  const base = process.env.APP_URL ?? "http://localhost:3000"
  res.setHeader("Location", `${base}/?auth=ok`)
  return res.status(302).end()
}
