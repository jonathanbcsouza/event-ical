import type { MatchStage } from "./fixtures";
import { SITE } from "./site";

export type CalendarSubscriptionParams = {
  teamCodes?: string[];
  stages?: MatchStage[];
  matchIds?: string[];
  includeAll?: boolean;
  timeZone?: string;
  download?: boolean;
};

function appendTimeZone(path: string, timeZone?: string): string {
  if (timeZone && timeZone !== "UTC") {
    return `${path}&tz=${encodeURIComponent(timeZone)}`;
  }
  return path;
}

export function buildCalendarApiUrl(
  baseUrl: string,
  params: CalendarSubscriptionParams,
): string {
  const {
    teamCodes = [],
    stages = [],
    matchIds = [],
    includeAll = false,
    timeZone,
    download,
  } = params;

  const parts: string[] = [];

  if (matchIds.length > 0) {
    parts.push(`ids=${encodeURIComponent(matchIds.join(","))}`);
  } else if (includeAll) {
    parts.push("all=1");
  } else {
    if (teamCodes.length > 0) {
      parts.push(`teams=${encodeURIComponent(teamCodes.join(","))}`);
    }
    if (stages.length > 0) {
      parts.push(`stages=${encodeURIComponent(stages.join(","))}`);
    }
  }

  if (parts.length === 0) return "";

  let path = `/api/calendar.ics?${parts.join("&")}`;
  path = appendTimeZone(path, timeZone);
  if (download) path += "&download=1";
  return `${baseUrl.replace(/\/$/, "")}${path}`;
}

/** @deprecated Use buildCalendarApiUrl with CalendarSubscriptionParams */
export function buildCalendarApiUrlFromIds(
  baseUrl: string,
  matchIds: string[],
  timeZone?: string,
): string {
  return buildCalendarApiUrl(baseUrl, {
    teamCodes: [],
    stages: [],
    matchIds,
    timeZone,
  });
}

export function buildWebcalUrl(calendarUrl: string): string {
  return calendarUrl.replace(/^https?:/, "webcal:");
}

export function buildGoogleSubscribeUrl(calendarUrl: string): string {
  const webcalUrl = buildWebcalUrl(calendarUrl);
  return `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcalUrl)}`;
}

export function buildGoogleAndroidIntentUrl(calendarUrl: string): string {
  const webUrl = buildGoogleSubscribeUrl(calendarUrl);
  const webcalUrl = buildWebcalUrl(calendarUrl);
  const cid = encodeURIComponent(webcalUrl);
  const fallback = encodeURIComponent(webUrl);
  return `intent://calendar.google.com/calendar/r?cid=${cid}#Intent;scheme=https;package=com.google.android.calendar;S.browser_fallback_url=${fallback};end`;
}

export function buildAppleSubscribeUrl(calendarUrl: string): string {
  return buildWebcalUrl(calendarUrl);
}

export function buildOutlookSubscribeUrl(
  calendarUrl: string,
  name = "FIFA World Cup 2026",
): string {
  const params = new URLSearchParams({ url: calendarUrl, name });
  return `https://outlook.live.com/calendar/0/addfromweb?${params.toString()}`;
}

export function buildOutlookOfficeSubscribeUrl(
  calendarUrl: string,
  name = "FIFA World Cup 2026",
): string {
  const params = new URLSearchParams({ url: calendarUrl, name });
  return `https://outlook.office.com/calendar/0/addfromweb?${params.toString()}`;
}

export function getClientBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return SITE.productionUrl;
}

export const ICS_FILENAME = "world-cup-2026.ics";
