# World Cup 2026 Calendar

Single-page app to pick FIFA World Cup 2026 teams and matches, then download a filtered `.ics` file or subscribe via Google Calendar.

## Features

- Multi-select teams grouped by World Cup group (A–L)
- Auto-filtered match list with per-match selection
- Download `.ics` for Apple Calendar, Outlook, and manual Google import
- One-click Google Calendar subscribe via webcal feed

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_APP_URL` to your public URL in production.

## Deploy on Vercel

1. Push this repo to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Set environment variable: `NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app`
4. Deploy — Next.js is auto-detected

## Data

Match fixtures live in [`data/fixtures-2026.json`](data/fixtures-2026.json) (104 matches). Regenerate from the source script:

```bash
node scripts/generate-fixtures.mjs
```

## API

`GET /api/calendar.ics?ids=1,2,3` — returns a VCALENDAR with the requested matches.

Not affiliated with FIFA.
