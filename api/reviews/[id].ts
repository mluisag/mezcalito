import type { VercelRequest, VercelResponse } from "@vercel/node"
import { and, eq, isNull } from "drizzle-orm"
import { db, schema } from "../_lib/db"
import { requireUser } from "../_lib/session"

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET")
    return res.status(405).json({ error: "method not allowed" })
  }
  const user = await requireUser(req, res)
  if (!user) return

  const id = typeof req.query.id === "string" ? req.query.id : ""
  if (!UUID_RE.test(id)) return res.status(400).json({ error: "invalid id" })

  const [review] = await db
    .select()
    .from(schema.mezcalReviews)
    .where(
      and(
        eq(schema.mezcalReviews.id, id),
        eq(schema.mezcalReviews.userId, user.id),
        isNull(schema.mezcalReviews.deletedAt),
      ),
    )
    .limit(1)

  if (!review) return res.status(404).json({ error: "not found" })
  return res.status(200).json({ review })
}
