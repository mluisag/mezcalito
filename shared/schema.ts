import {
  pgTable,
  uuid,
  text,
  integer,
  real,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// ─── users ───────────────────────────────────────────────
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique(), // nullable for guest mode
  firstName: text("first_name"),
  lastName: text("last_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

// ─── mezcal_reviews ──────────────────────────────────────
export const mezcalReviews = pgTable("mezcal_reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Bottle identity (all optional — mezcal labels are inconsistent)
  brand: text("brand"),
  name: text("name"),
  agave: text("agave"),
  maestro: text("maestro"),
  village: text("village"),
  region: text("region"),
  stillType: text("still_type"), // copper / clay / mixed
  abv: real("abv"),
  volumeMl: integer("volume_ml"),
  vintageYear: integer("vintage_year"),

  // Tasting + memory
  flavorProfile: jsonb("flavor_profile"), // { "Smoked": ["Campfire"], "Agave": ["Fresh grass"] }
  rating: text("rating"), // thumbs_up / neutral / thumbs_down
  tastingNotes: text("tasting_notes"),
  personalNotes: text("personal_notes"),

  // Photo (the only required content field)
  photoUrl: text("photo_url").notNull(),

  // When + where she tasted it
  tastedAt: timestamp("tasted_at", { withTimezone: true }).defaultNow().notNull(),
  venueName: text("venue_name"),
  venueType: text("venue_type"), // bar / restaurant / home / palenque / other
  city: text("city"),
  country: text("country"),

  // Engagement + ranking
  drinkCount: integer("drink_count").default(1).notNull(),
  eloScore: real("elo_score").default(1200).notNull(),
  comparisonCount: integer("comparison_count").default(0).notNull(),

  // Lifecycle
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
})

// ─── mezcal_comparisons ──────────────────────────────────
export const mezcalComparisons = pgTable("mezcal_comparisons", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  winnerId: uuid("winner_id")
    .notNull()
    .references(() => mezcalReviews.id, { onDelete: "cascade" }),
  loserId: uuid("loser_id")
    .notNull()
    .references(() => mezcalReviews.id, { onDelete: "cascade" }),

  // Capture full ELO state for replay/audit
  ratingWinnerBefore: real("rating_winner_before").notNull(),
  ratingLoserBefore: real("rating_loser_before").notNull(),
  ratingWinnerAfter: real("rating_winner_after").notNull(),
  ratingLoserAfter: real("rating_loser_after").notNull(),
  kFactor: integer("k_factor").notNull(),
  confidence: real("confidence"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

// ─── relations (for type-safe joins) ─────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  reviews: many(mezcalReviews),
  comparisons: many(mezcalComparisons),
}))

export const mezcalReviewsRelations = relations(mezcalReviews, ({ one, many }) => ({
  user: one(users, {
    fields: [mezcalReviews.userId],
    references: [users.id],
  }),
  comparisonsAsWinner: many(mezcalComparisons, { relationName: "winner" }),
  comparisonsAsLoser: many(mezcalComparisons, { relationName: "loser" }),
}))

export const mezcalComparisonsRelations = relations(mezcalComparisons, ({ one }) => ({
  user: one(users, {
    fields: [mezcalComparisons.userId],
    references: [users.id],
  }),
  winner: one(mezcalReviews, {
    fields: [mezcalComparisons.winnerId],
    references: [mezcalReviews.id],
    relationName: "winner",
  }),
  loser: one(mezcalReviews, {
    fields: [mezcalComparisons.loserId],
    references: [mezcalReviews.id],
    relationName: "loser",
  }),
}))

// ─── inferred types ──────────────────────────────────────
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type MezcalReview = typeof mezcalReviews.$inferSelect
export type NewMezcalReview = typeof mezcalReviews.$inferInsert
export type MezcalComparison = typeof mezcalComparisons.$inferSelect
export type NewMezcalComparison = typeof mezcalComparisons.$inferInsert
