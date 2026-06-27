import { unstable_cache } from "next/cache";

export type FeedRow = {
  matchNumber: number;
  roundNumber: number;
  dateUtc: string;
  homeTeam: string;
  awayTeam: string;
  group: string | null;
  homeTeamScore: number | null;
  awayTeamScore: number | null;
  winner: string;
};

const DEFAULT_FEED_URL =
  "https://fixturedownload.com/feed/json/fifa-world-cup-2026";

const LIVE_FEED_URL =
  process.env.LIVE_FEED_URL?.trim() || DEFAULT_FEED_URL;

const REVALIDATE_SECONDS = 1800;

type RawFeedRow = {
  MatchNumber: number;
  RoundNumber: number;
  DateUtc: string;
  HomeTeam: string;
  AwayTeam: string;
  Group: string | null;
  HomeTeamScore: number | null;
  AwayTeamScore: number | null;
  Winner: string;
};

function parseFeedRow(raw: RawFeedRow): FeedRow {
  return {
    matchNumber: raw.MatchNumber,
    roundNumber: raw.RoundNumber,
    dateUtc: raw.DateUtc,
    homeTeam: raw.HomeTeam,
    awayTeam: raw.AwayTeam,
    group: raw.Group,
    homeTeamScore: raw.HomeTeamScore,
    awayTeamScore: raw.AwayTeamScore,
    winner: raw.Winner ?? "",
  };
}

// IMPORTANT: unstable_cache JSON-serializes its return value, so we must cache a
// plain array here. A Map does not survive serialization (it deserializes to
// `{}`), which previously caused intermittent `feedMap.get is not a function`
// 500s on cache hits. We rebuild the Map from the array in getLiveSchedule().
async function fetchLiveScheduleUncached(): Promise<FeedRow[] | null> {
  try {
    const res = await fetch(LIVE_FEED_URL, {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["live-schedule"] },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as RawFeedRow[];
    if (!Array.isArray(data)) return null;
    return data.map(parseFeedRow);
  } catch {
    return null;
  }
}

const getCachedLiveSchedule = unstable_cache(
  fetchLiveScheduleUncached,
  ["live-schedule"],
  { revalidate: REVALIDATE_SECONDS, tags: ["live-schedule"] },
);

export async function getLiveSchedule(): Promise<Map<number, FeedRow> | null> {
  const rows = await getCachedLiveSchedule();
  if (!rows || !Array.isArray(rows)) return null;
  const map = new Map<number, FeedRow>();
  for (const row of rows) {
    map.set(row.matchNumber, row);
  }
  return map;
}

export function feedDateToUtcIso(dateUtc: string): string {
  return new Date(dateUtc.replace(" ", "T")).toISOString();
}
