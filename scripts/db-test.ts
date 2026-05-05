/**
 * Quick smoke test for the Neon connection + schema.
 * Runs INSERT → SELECT → DELETE round-trip on a throwaway user + review.
 *
 *   npm run db:test
 */
import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import { eq } from "drizzle-orm"
import { users, mezcalReviews } from "../shared/schema"

if (!process.env.DATABASE_URL) {
  console.error("✗ DATABASE_URL is not set. Add it to .env first.")
  process.exit(1)
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const db = drizzle(pool)

async function main() {
  console.log("→ Connecting to Neon…")

  // 1. Insert a test user
  const [user] = await db
    .insert(users)
    .values({ email: `smoke-test-${Date.now()}@example.com`, firstName: "Smoke" })
    .returning()
  console.log("✓ Inserted user:", user.id)

  // 2. Insert a test review tied to that user
  const [review] = await db
    .insert(mezcalReviews)
    .values({
      userId: user.id,
      brand: "Smoke Test Mezcal",
      name: "Test Espadín",
      agave: "Espadín",
      photoUrl: "https://placeholder.test/photo.jpg",
      tastingNotes: "Smoky, citrus, smooth finish.",
      city: "Oaxaca",
      country: "Mexico",
    })
    .returning()
  console.log("✓ Inserted review:", review.id)

  // 3. Read it back
  const fetched = await db
    .select()
    .from(mezcalReviews)
    .where(eq(mezcalReviews.id, review.id))
  console.log("✓ Read back review:", {
    brand: fetched[0].brand,
    elo: fetched[0].eloScore,
    drinkCount: fetched[0].drinkCount,
  })

  // 4. Clean up (cascades to the review via FK)
  await db.delete(users).where(eq(users.id, user.id))
  console.log("✓ Cleaned up test data")

  console.log("\nAll good. Schema is live and round-trips correctly.")
  await pool.end()
}

main().catch((err) => {
  console.error("✗ Smoke test failed:", err)
  process.exit(1)
})
