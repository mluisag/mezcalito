# Mezcalito

> Capture knowledge and moments in a beautiful way.

Mezcalito is a personal mezcal tasting journal. Snap a bottle, log what you tasted, and over time discover what you actually prefer through head-to-head comparisons. No five-star ratings, no public feed, no follower count. Quiet, design-led, and built for one thing: building your own mezcal journey.

---

## What makes it different

- **Capture as composition.** Every entry becomes a beautiful card — bottle photo, your tasting notes, agave / maestro / village treated like film credits, not buried metadata. Filling it out feels like making something.
- **Ranking by comparison, not score.** Pairwise ELO comparisons of mezcals you've already tried. The more you compare, the more your real taste profile emerges. Easier and more honest than rating-out-of-10 because pairwise choice is what humans actually do.
- **Knowledge is intrinsic, not bolted on.** No popup lessons, no sensei mode. The fields you fill — agave species, maestro mezcalero, village, region, still type, vintage year, volume — _are_ the learning. The act of logging is the studying.
- **Sharing is intimate.** One-tap share to a friend or group chat. No public feed. No social network. Built for the small circle of people who actually care about mezcal.

## The 12-family flavor wheel

Every entry maps to one or more of 12 mezcal-specific flavor families with 80+ specific notes:

🌱 Agave · 🌿 Herbal · 🌸 Floral · 🍋 Citric · 🍎 Fruity · 🌵 Maguey · ❄️ Mentholated · 💨 Smoked · 🫚 Spices · 🪵 Wood · 🌍 Earthy · 🍶 Alcoholic

## Status

This is **week 1 of a fresh build**. Updated as work lands.

- [x] Day 1 — Project scaffold (Vite + React + TS + Tailwind v4 + shadcn + Wouter + TanStack Query + Inter)
- [x] Day 2 — Database (Neon Postgres) + Drizzle schema (users, mezcal_reviews, mezcal_comparisons) + migrations
- [x] Day 3 — API + email-only auth (magic links via Resend) + guest mode
- [ ] Day 4 — Deploy to Vercel (domain reserved at mezcalito.app via Vercel) + PWA install
- [ ] Day 5 — Capture form placeholder + design polish

After Week 1: photo capture pipeline (camera + EXIF + GPS + OCR), capture form, visual archive, 12-family flavor wheel widget, ELO comparison ritual, share card, friend invites.

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | React 19, TypeScript, Vite 8, Tailwind v4, shadcn/ui, Wouter, TanStack Query |
| Backend | Vercel serverless functions (planned), Drizzle ORM |
| Database | Neon Postgres |
| Auth (planned) | Email-only magic links via Resend, guest mode |
| Photo (planned) | Browser camera API, ExifReader, Tesseract.js OCR, Google Maps reverse-geocode |
| Distribution | Web app + PWA, eventually native via Expo |

## Local development

Prerequisites: Node 20+, a [Neon](https://neon.tech) Postgres database.

```bash
git clone https://github.com/mluisag/mezcalito.git
cd mezcalito
npm install

# Copy env template and fill in DATABASE_URL from your Neon dashboard
cp .env.example .env

# Apply schema migrations
npm run db:migrate

# Optional: round-trip smoke test
npm run db:test

# Start the dev server
npm run dev
```

Visit http://localhost:5173.

To use Mezcalito on your phone over the same Wi-Fi while developing:

```bash
npm run dev -- --host
# Then visit the Network URL Vite prints (e.g. http://192.168.1.x:5173) on your phone.
```

## Useful scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build |
| `npm run db:generate` | Generate new SQL migration after editing `shared/schema.ts` |
| `npm run db:migrate` | Apply pending migrations to your Neon database |
| `npm run db:studio` | Open Drizzle Studio (web UI for browsing live data) |
| `npm run db:test` | Round-trip smoke test for the database |

## Project structure

```
mezcalito/
├── src/                      # React app (client)
│   ├── components/ui/        # shadcn components (button, card, form, input, label, textarea)
│   ├── lib/utils.ts          # cn() + helpers
│   ├── App.tsx               # routes + floating nav shell
│   ├── main.tsx              # entry, QueryClient wrap
│   └── index.css             # Tailwind + shadcn theme tokens + Inter import
├── shared/
│   └── schema.ts             # Drizzle schema (single source of truth)
├── drizzle/                  # Generated SQL migrations (committed to git)
├── scripts/
│   ├── db-migrate.ts         # Non-interactive migration runner
│   └── db-test.ts            # Database smoke test
├── drizzle.config.ts
├── vite.config.ts
└── README.md
```

## Design system

- **Palette:** purple → fuchsia gradients on a soft warm background
- **Surfaces:** glassmorphism cards with soft shadows, generously rounded (`rounded-2xl`, `rounded-3xl`)
- **Navigation:** floating bottom bar, mobile-first
- **Typography:** Inter Variable, tight, modern, high-end
- **Voice:** less words, always. Communicate through icons, imagery, and gesture — not paragraphs.

## Roadmap (high level)

- **v1 (Week 1-5):** capture flow, 12-family flavor wheel, ELO comparisons, visual archive, card share, magic-link auth, deploy as PWA, invite 3-5 mezcal-loving friends
- **v1.5:** Year-end "Mezcal Wrapped" recap card · maestro / village enrichment · richer photo composition · controlled lists for agave/region/maestro
- **v2:** Import flow for legacy Camera Roll + Notes · Mexico map view (where mezcals come from + where you've tasted them) · WhatsApp bot integration · native mobile via Expo

## License

Private. All rights reserved.

---

Built with care, in Oaxaca's spirit, by [@mluisag](https://github.com/mluisag).
