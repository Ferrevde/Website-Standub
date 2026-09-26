# Standub — Foundation

Static artist site for Belgian live electronic performer Standub.

- `index.html` — single-page foundation with atmospheric + rhythmic design.
- `AGENTS.md` / `.hermes.md` — project rules.
- Content placeholders clearly marked; replace when real assets/contacts/dates arrive.

No backend, no CMS, no analytics, no auth. Deploy to Cloudflare Pages via GitHub.

## Tour Dates / Worker
- Worker: functions/api/[[path]].js (GET /api/tour-dates, PUT auth, DELETE auth)
- KV binding: TOUR_DATES (wrangler.toml)
- Admin: /admin (password-protected; enters auth header; no secret in source)
- Set ADMIN_PASSWORD: wrangler secret put ADMIN_PASSWORD
- Set KV namespace binding id in wrangler.toml or Cloudflare dashboard
- Local init: wrangler kv:key put "tour-dates" '[{"id":"a","date":"2026-10-24","venue":"X","city":"Turnhout"}]' --binding=TUR_DATES --local
- Homepage fetches /api/tour-dates; empty state if unavailable.
