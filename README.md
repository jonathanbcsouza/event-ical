# World Cup 2026 - Calendar

Single-page app to build a personal FIFA World Cup 2026 match calendar. Pick teams, choose matches, then export to Google Calendar, Outlook, or Apple Calendar.

**Live site:** [world-cup-ical.vercel.app](https://world-cup-ical.vercel.app)

## Features

- **3-step flow** — pick teams → choose matches → export calendar
- **Team picker** — multi-select nations grouped by World Cup group (A–L)
- **Match list & calendar view** — filter by your teams; select individual matches (nothing pre-selected)
- **Google Calendar** — one-click subscribe via webcal feed
- **Outlook** — one-click subscribe via Outlook on the web (live feed, like Google)
- **Download .ics** — one-time file for Apple Calendar or manual import
- **Dark mode** — default dark theme with light toggle
- **Donate** — optional Stripe contribution link

## How it works

1. **Step 1 — Pick your teams** — tap the nations you follow, then click **Done**
2. **Step 2 — Choose your matches** — check the games you want (use *Select all* if needed), then **Done**
3. **Step 3 — Export your calendar**
   - **Add to Google Calendar** — subscribes to a live feed of your selected matches
   - **Add to Outlook** — subscribes in Outlook on the web (confirm once)
   - **Download .ics** — one-time file for Apple Calendar or manual import

Each step shows a pulsing prompt until you make a selection, then unlocks **Done** to collapse that panel.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local`:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | Public URL for calendar subscribe links (use production URL when testing webcal locally) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics measurement ID (optional locally) |

## Deploy on Vercel

1. Push this repo to GitHub
2. Import the project in [Vercel](https://vercel.com) (Framework: **Next.js**)
3. Set environment variables:
   - `NEXT_PUBLIC_APP_URL=https://world-cup-ical.vercel.app`
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-BYRPBMKJ6M`
4. Deploy

`NEXT_PUBLIC_*` variables are embedded at **build time** — redeploy after changing them.

## Data

Match **schedules** live in [`data/fixtures-2026.json`](data/fixtures-2026.json) (104 matches). Regenerate from the source script:

```bash
node scripts/generate-fixtures.mjs
```

**Scores** are fetched live on every page load and calendar feed request from [openfootball](https://github.com/openfootball/worldcup.json) (`2026/worldcup.json`). If that fetch fails, the app falls back to [`data/results-2026.json`](data/results-2026.json).

To refresh the bundled fallback file manually:

```bash
npm run sync-results
```

## API

`GET /api/calendar.ics?ids=1,2,3`

Returns a `VCALENDAR` with the requested match IDs. Used by download links and the Google Calendar webcal subscription.

Example:

```text
https://world-cup-ical.vercel.app/api/calendar.ics?ids=1,2,3
```

## Google Calendar notes

Subscribed feeds ignore ICS colour metadata. To use green events, open the calendar in Google Calendar → ⋮ → pick **green**.

Not affiliated with FIFA.
