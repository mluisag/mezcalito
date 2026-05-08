import type { VercelRequest, VercelResponse } from "@vercel/node"
import { db, schema } from "../_lib/db"
import { setSessionCookie } from "../_lib/session"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).json({ error: "method not allowed" })
  }
  const [user] = await db
    .insert(schema.users)
    .values({ email: null })
    .returning()
  setSessionCookie(res, user.id)
  return res.status(200).json({
    user: {
      id: user.id,
      email: null,
      firstName: null,
      lastName: null,
      isGuest: true,
    },
  })
}
