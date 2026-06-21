import ical, { ICalCalendarMethod } from "ical-generator";
import {
  getMatchesByIds,
  getStageLabel,
  formatMatchTitle,
  type Match,
} from "./fixtures";

const MATCH_DURATION_HOURS = 2;
const CALENDAR_COLOR = "#059669";
const CALENDAR_DOMAIN =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, "") ??
  "event-ical.vercel.app";

export function generateCalendarIcs(matchIds: string[]): string {
  const matches = getMatchesByIds(matchIds).sort(
    (a, b) => new Date(a.startUtc).getTime() - new Date(b.startUtc).getTime(),
  );

  const calendar = ical({
    name: "FIFA World Cup 2026",
    description: "Selected FIFA World Cup 2026 matches",
    timezone: "UTC",
    method: ICalCalendarMethod.PUBLISH,
    prodId: { company: "event-ical", product: "wc2026" },
    color: CALENDAR_COLOR,
  });

  for (const match of matches) {
    addMatchEvent(calendar, match);
  }

  return applyEventColors(calendar.toString());
}

function applyEventColors(ics: string): string {
  return ics.replace(/BEGIN:VEVENT\r\n/g, `BEGIN:VEVENT\r\nCOLOR:${CALENDAR_COLOR}\r\n`);
}

function addMatchEvent(
  calendar: ReturnType<typeof ical>,
  match: Match,
): void {
  const start = new Date(match.startUtc);
  const end = new Date(start.getTime() + MATCH_DURATION_HOURS * 60 * 60 * 1000);

  calendar.createEvent({
    id: `wc2026-match-${match.id}@${CALENDAR_DOMAIN}`,
    start,
    end,
    summary: formatMatchTitle(match),
    description: [
      getStageLabel(match.stage),
      `Match ${match.matchNumber}`,
      `${match.home.name} vs ${match.away.name}`,
    ].join("\n"),
    location: `${match.venue}, ${match.city}`,
    timezone: "UTC",
  });
}
