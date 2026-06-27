import ical, { ICalCalendarMethod } from "ical-generator";
import { getVtimezoneComponent } from "@touch4it/ical-timezones";
import { DateTime } from "luxon";
import {
  formatMatchScore,
  formatMatchTitle,
  getStageLabel,
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
  matches: Match[],
  timeZone = "UTC",
): string {
  const tz = isValidTimeZone(timeZone) ? timeZone : "UTC";
  const sorted = [...matches].sort(
    (a, b) => new Date(a.startUtc).getTime() - new Date(b.startUtc).getTime(),
  );

  const calendar = ical({
    name: "FIFA World Cup 2026",
    description: "FIFA World Cup 2026 matches",
    method: ICalCalendarMethod.PUBLISH,
    prodId: { company: "world-cup-ical", product: "wc2026" },
    color: CALENDAR_COLOR,
  });

  if (tz !== "UTC") {
    calendar.timezone({ name: tz, generator: getVtimezoneComponent });
  }

  for (const match of sorted) {
    addMatchEvent(calendar, match, tz);
  }

  return calendar.toString();
}

function addMatchEvent(
  calendar: ReturnType<typeof ical>,
  match: Match,
  timeZone: string,
): void {
  const start = DateTime.fromJSDate(new Date(match.startUtc)).setZone(timeZone);
  const end = start.plus({ hours: MATCH_DURATION_HOURS });
  const score = formatMatchScore(match);

  const descriptionLines = [
    getStageLabel(match.stage),
    `Match ${match.matchNumber}`,
    `${match.home.name} vs ${match.away.name}`,
  ];
  if (score) {
    descriptionLines.push(`Final score: ${score}`);
  }

  calendar.createEvent({
    id: `wc2026-match-${match.id}@${CALENDAR_DOMAIN}`,
    start,
    end,
    summary: score
      ? `${formatMatchTitle(match)} (${score})`
      : formatMatchTitle(match),
    description: descriptionLines.join("\n"),
    location: `${match.venue}, ${match.city}`,
    timezone: timeZone,
  });
}
