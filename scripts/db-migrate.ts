/**
 * Apply Drizzle migrations to the database.
 *
 *   npm run db:migrate
 *
 * Reads SQL files from ./drizzle/ and applies any not yet recorded in the
 * __drizzle_migrations table.
 */
import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import { Pool } from "pg"

if (!process.env.DATABASE_URL) {
  console.error("✗ DATABASE_URL is not set. Add it to .env first.")
  process.exit(1)
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const db = drizzle(pool)

async function main() {
  console.log("→ Applying migrations from ./drizzle/…")
  await migrate(db, { migrationsFolder: "./drizzle" })
  console.log("✓ Migrations applied")
  await pool.end()
}

main().catch((err) => {
  console.error("✗ Migration failed:", err)
  process.exit(1)
})
