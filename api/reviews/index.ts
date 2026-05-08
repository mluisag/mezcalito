import type { VercelRequest, VercelResponse } from "@vercel/node"
import { and, desc, eq, isNull } from "drizzle-orm"
import { z } from "zod"
import { db, schema } from "../_lib/db"
import { requireUser } from "../_lib/session"

const createSchema = z.object({
  brand: z.string().trim().min(1).max(200).optional(),
  name: z.string().trim().min(1).max(200).optional(),
  agave: z.string().trim().min(1).max(200).optional(),
  maestro: z.string().trim().min(1).max(200).optional(),
  village: z.string().trim().min(1).max(200).optional(),
  region: z.string().trim().min(1).max(200).optional(),
  stillType: z.string().trim().min(1).max(50).optional(),
  abv: z.number().min(0).max(100).optional(),
  volumeMl: z.number().int().positive().optional(),
  vintageYear: z.number().int().min(1800).max(2100).optional(),
  flavorProfile: z.record(z.string(), z.array(z.string())).optional(),
  rating: z.enum(["thumbs_up", "neutral", "thumbs_down"]).optional(),
  tastingNotes: z.string().max(4000).optional(),
  personalNotes: z.string().max(4000).optional(),
  photoUrl: z.string().url(),
  tastedAt: z.string().datetime().optional(),
  venueName: z.string().trim().min(1).max(200).optional(),
  venueType: z.enum(["bar", "restaurant", "home", "palenque", "other"]).optional(),
  city: z.string().trim().min(1).max(200).optional(),
  country: z.string().trim().min(1).max(200).optional(),
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = await requireUser(req, res)
  if (!user) return

  if (req.method === "GET") {
    const reviews = await db
      .select()
      .from(schema.mezcalReviews)
      .where(
        and(
          eq(schema.mezcalReviews.userId, user.id),
          isNull(schema.mezcalReviews.deletedAt),
        ),
      )
      .orderBy(desc(schema.mezcalReviews.tastedAt))
    return res.status(200).json({ reviews })
  }

  if (req.method === "POST") {
    const parsed = createSchema.safeParse(req.body ?? {})
    if (!parsed.success) {
      return res.status(400).json({ error: "invalid body", issues: parsed.error.issues })
    }
    const { tastedAt, ...rest } = parsed.data
    const [review] = await db
      .insert(schema.mezcalReviews)
      .values({
        ...rest,
        userId: user.id,
        tastedAt: tastedAt ? new Date(tastedAt) : new Date(),
      })
      .returning()
    return res.status(201).json({ review })
  }

  res.setHeader("Allow", "GET, POST")
  return res.status(405).json({ error: "method not allowed" })
}
