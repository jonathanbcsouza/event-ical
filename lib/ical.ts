import ical, { ICalCalendarMethod } from "ical-generator";
import { getVtimezoneComponent } from "@touch4it/ical-timezones";
import { DateTime } from "luxon";
import {
  getMatchesByIds,
  getStageLabel,
  formatMatchTitle,
  type Match,
} from "./fixtures";
import { SITE } from "./site";
import { isValidTimeZone } from "./timezones";

const MATCH_DURATION_HOURS = 2;
const CALENDAR_COLOR = "#059669";
const CALENDAR_DOMAIN =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, "") ??
  SITE.productionUrl.replace(/^https?:\/\//, "");

export function generateCalendarIcs(
  matchIds: string[],
  timeZone = "UTC",
): string {
  const tz = isValidTimeZone(timeZone) ? timeZone : "UTC";
  const matches = getMatchesByIds(matchIds).sort(
    (a, b) => new Date(a.startUtc).getTime() - new Date(b.startUtc).getTime(),
  );

  const calendar = ical({
    name: "FIFA World Cup 2026",
    description: "Selected FIFA World Cup 2026 matches",
    method: ICalCalendarMethod.PUBLISH,
    prodId: { company: "world-cup-ical", product: "wc2026" },
    color: CALENDAR_COLOR,
  });

  // UTC needs no VTIMEZONE; other zones emit a proper VTIMEZONE block so the
  // TZID-anchored events are valid across Google, Apple, and Outlook.
  if (tz !== "UTC") {
    calendar.timezone({ name: tz, generator: getVtimezoneComponent });
  }

  for (const match of matches) {
    addMatchEvent(calendar, match, tz);
  }

  return calendar.toString();
}

function addMatchEvent(
  calendar: ReturnType<typeof ical>,
  match: Match,
  timeZone: string,
): void {
  // startUtc is an absolute instant. We hand ical-generator a zone-aware Luxon
  // DateTime so it emits the correct local time anchored to TZID (a plain JS
  // Date would be misinterpreted using the server's system timezone).
  const start = DateTime.fromJSDate(new Date(match.startUtc)).setZone(timeZone);
  const end = start.plus({ hours: MATCH_DURATION_HOURS });

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
    timezone: timeZone,
  });
}
