# Security Leader Podcast

Redesign of [securityleaderpodcast.com](https://securityleaderpodcast.com/) — Next.js 16, TypeScript,
Tailwind v4, Motion, PostgreSQL + Prisma, with an admin CMS and official YouTube Data API sync.

## Setup

```bash
npm install
cp .env.example .env          # fill in the values below
npm run db:migrate            # or: npx prisma migrate dev
npm run admin:create -- you@example.com "a-long-password"
npm run bootstrap             # optional: seed real episodes from the channel feed
npm run dev
```

### Environment

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Session cookie signing key — `openssl rand -hex 32` |
| `YOUTUBE_API_KEY` | YouTube Data API v3 key (server-side only, never `NEXT_PUBLIC_`) |
| `YOUTUBE_CHANNEL_ID` | `UCVTgPtlFP9KvDbnoFQzHTFg` |
| `CRON_SECRET` | Bearer token the scheduled sync must present |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin, used for SEO/sitemap |

## Routes

Public: `/`, `/about`, `/contact` · Admin: `/admin/login`, `/admin`, `/admin/content`, `/admin/messages`

## YouTube sync

`lib/youtube.ts` reads the channel's uploads playlist via `playlistItems.list` (1 quota unit per page)
rather than `search.list` (100), then fetches durations via `videos.list`.

- **Manual** — "Sync now" in `/admin`, or `npm run sync`
- **Scheduled** — `vercel.json` runs `GET /api/sync` every 6 hours with `Authorization: Bearer $CRON_SECRET`
- **Duplicates** — `Episode.youtubeId` is unique; existing rows are updated, not re-created
- **Admin edits win** — saving an episode sets `locked = true`, after which sync stops overwriting its
  title, description, thumbnail and date. The admin list shows an *Edited* badge for these.

`npm run bootstrap` is a one-off seed from the channel's public Atom feed, for use before an API key is
provisioned. It carries no durations and truncated descriptions; the Data API fills those in.

## Content

Everything on the public pages is editable at `/admin/content` (hero, about, topics, contact, SEO).
Defaults in `lib/content.ts` are verbatim copy from the current site — no placeholder text anywhere.
Optional episode fields (summary, show notes, transcript, guest, takeaways, links, Spotify, Apple) render
only when populated; empty ones produce no markup.

## Animation

Scroll reveals are native CSS scroll-driven animations (`animation-timeline: view()`), guarded by
`@supports` so unsupported browsers simply show content. Motion handles enter/exit and the player modal.
The whole system collapses under `prefers-reduced-motion: reduce`.

No GSAP: nothing in the design needed a JS timeline that CSS scroll-driven animations don't cover.

## Checks

```bash
npm test           # video ID parsing, duration formatting, excerpting, password hashing
npm run test:contact   # contact form validation, honeypot, persistence (hits the DB)
```

## Notes

- Contact submissions are stored in `ContactMessage` and read at `/admin/messages`. No email provider is
  wired up — add one in `app/(site)/contact/actions.ts` when credentials exist.
- The CMS stores `spotifyUrl` / `appleUrl` per episode and renders those links only when set, so other
  podcast platforms can be added without a schema change.
- `prisma` (dev CLI) has a transitive `deepmerge-ts` advisory. Not in the runtime bundle.
