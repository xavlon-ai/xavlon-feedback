# Xavlon Feedback MVP

Sandbox-ready standalone feedback board implementing the approved MVP flows: public submission, anonymous browser-token voting, search, multi-status filtering, status display, and password-protected administration.

## Run locally

1. Copy `.env.example` to `.env` and replace all example values.
2. Run `npm test` and `npm run check`.
3. Run `npm start`, then open `http://localhost:3000`.
4. Log in at `/admin/login` with the local `ADMIN_PASSWORD` value.

The app uses an in-memory development repository so it can run without external provisioning. `db/migrations/001_initial_schema.sql` is the production PostgreSQL/Supabase schema and includes database-enforced status and vote integrity. Replace the repository adapter in `src/store.js` with a parameterized Postgres/Supabase adapter before production. No credentials are in source.

## Security boundaries

All mutations are server routes. The server validates input, applies per-IP throttles, uses an HTTP-only anonymous voter cookie (only its keyed hash is stored), guards admin routes with an HTTP-only signed session cookie, checks same-origin on mutations, uses generic login errors, and renders user input as text. This source bundle is not production approval: D-3 requires MFA-capable administrator access before launch.

## Tests

`npm test` covers validation, public filtering/search/visibility, atomic vote add/remove/idempotency, protected admin mutation behavior, and removal visibility. See `docs/test-execution-report.md` for the executed command and expected evidence.
