import type { VercelRequest, VercelResponse } from "@vercel/node"
import { getCurrentUser } from "../_lib/session"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET")
    return res.status(405).json({ error: "method not allowed" })
  }
  const user = await getCurrentUser(req)
  if (!user) return res.status(200).json({ user: null })
  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isGuest: user.email === null,
    },
  })
}
