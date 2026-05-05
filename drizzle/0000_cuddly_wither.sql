CREATE TABLE "mezcal_comparisons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"winner_id" uuid NOT NULL,
	"loser_id" uuid NOT NULL,
	"rating_winner_before" real NOT NULL,
	"rating_loser_before" real NOT NULL,
	"rating_winner_after" real NOT NULL,
	"rating_loser_after" real NOT NULL,
	"k_factor" integer NOT NULL,
	"confidence" real,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mezcal_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"brand" text,
	"name" text,
	"agave" text,
	"maestro" text,
	"village" text,
	"region" text,
	"still_type" text,
	"abv" real,
	"volume_ml" integer,
	"vintage_year" integer,
	"flavor_profile" jsonb,
	"rating" text,
	"tasting_notes" text,
	"personal_notes" text,
	"photo_url" text NOT NULL,
	"tasted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"venue_name" text,
	"venue_type" text,
	"city" text,
	"country" text,
	"drink_count" integer DEFAULT 1 NOT NULL,
	"elo_score" real DEFAULT 1200 NOT NULL,
	"comparison_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text,
	"first_name" text,
	"last_name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "mezcal_comparisons" ADD CONSTRAINT "mezcal_comparisons_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mezcal_comparisons" ADD CONSTRAINT "mezcal_comparisons_winner_id_mezcal_reviews_id_fk" FOREIGN KEY ("winner_id") REFERENCES "public"."mezcal_reviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mezcal_comparisons" ADD CONSTRAINT "mezcal_comparisons_loser_id_mezcal_reviews_id_fk" FOREIGN KEY ("loser_id") REFERENCES "public"."mezcal_reviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mezcal_reviews" ADD CONSTRAINT "mezcal_reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;