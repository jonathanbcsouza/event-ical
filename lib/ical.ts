import ical, { ICalCalendarMethod } from "ical-generator";
import { getVtimezoneComponent } from "@touch4it/ical-timezones";
import { DateTime } from "luxon";
import {
  formatMatchScore,
  getStageLabel,
  type Match,
} from "./fixtures";
import { getFlag } from "./flags";
import { SITE } from "./site";
import { isValidTimeZone } from "./timezones";

const MATCH_DURATION_HOURS = 2;
const CALENDAR_COLOR = "#059669";
const CALENDAR_DOMAIN =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, "") ??
  SITE.productionUrl.replace(/^https?:\/\//, "");

const DONATE_LINE = `Enjoying this calendar? <a href="${SITE.donateUrl}">Buy me a coffee</a> :)`;

function formatCalendarTitle(match: Match): string {
  const home = `${getFlag(match.home.code)} ${match.home.name}`;
  const away = `${getFlag(match.away.code)} ${match.away.name}`;
  return `${home} - ${away}`;
}

/** RFC 5545 line folding can split escaped \\n and URLs; unfold before serving. */
function unfoldIcsLines(ics: string): string {
  const lines = ics.split(/\r\n|\n|\r/);
  const unfolded: string[] = [];
  for (const line of lines) {
    if ((line.startsWith(" ") || line.startsWith("\t")) && unfolded.length > 0) {
      unfolded[unfolded.length - 1] += line.slice(1);
    } else {
      unfolded.push(line);
    }
  }
  return unfolded.join("\r\n");
}

function buildEventDescription(
  match: Match,
  score: string | undefined,
): { plain: string; html: string } {
  const lines = [
    getStageLabel(match.stage),
    `Match ${match.matchNumber}`,
    `${match.home.name} vs ${match.away.name}`,
  ];
  if (score) lines.push(`Final score: ${score}`);

  // Google Calendar subscriptions ignore X-ALT-DESC; use HTML <a> in
  // DESCRIPTION (supported by Google Calendar for links per their docs).
  const plain = [...lines, "", DONATE_LINE].join("\n");
  const html = `${lines.join("<br>")}<br><br>${DONATE_LINE}`;
  return { plain, html };
}

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

  return unfoldIcsLines(calendar.toString());
}

function addMatchEvent(
  calendar: ReturnType<typeof ical>,
  match: Match,
  timeZone: string,
): void {
  const start = DateTime.fromJSDate(new Date(match.startUtc)).setZone(timeZone);
  const end = start.plus({ hours: MATCH_DURATION_HOURS });
  const score = formatMatchScore(match);
  const description = buildEventDescription(match, score);
  const title = formatCalendarTitle(match);
  const now = new Date();

  calendar.createEvent({
    id: `wc2026-v2-match-${match.id}@${CALENDAR_DOMAIN}`,
    start,
    end,
    summary: score ? `${title} (${score})` : title,
    description,
    location: `${match.venue}, ${match.city}`,
    timezone: timeZone,
    url: SITE.donateUrl,
    sequence: 4,
    stamp: now,
    lastModified: now,
  });
}
