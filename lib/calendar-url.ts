import { SITE } from "./site";

export function buildCalendarApiUrl(
  baseUrl: string,
  matchIds: string[],
  timeZone?: string,
): string {
  if (matchIds.length === 0) return "";
  const ids = matchIds.join(",");
  let path = `/api/calendar.ics?ids=${encodeURIComponent(ids)}`;
  if (timeZone && timeZone !== "UTC") {
    path += `&tz=${encodeURIComponent(timeZone)}`;
  }
  return `${baseUrl.replace(/\/$/, "")}${path}`;
}

export function buildWebcalUrl(calendarUrl: string): string {
  return calendarUrl.replace(/^https?:/, "webcal:");
}

export function buildGoogleSubscribeUrl(calendarUrl: string): string {
  const webcalUrl = buildWebcalUrl(calendarUrl);
  return `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcalUrl)}`;
}

/** Android intent that tries the Google Calendar app, falling back to the web URL. */
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
  // Outlook on the web "Subscribe from web" expects an https:// ICS URL.
  // Microsoft moderator guidance: replace webcal:// with https:// (Q&A 4563216).
  // Deep link pattern is community-documented; Microsoft only documents manual
  // Add calendar → Subscribe from web → paste URL → Import.
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
