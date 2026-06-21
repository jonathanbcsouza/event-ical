export function buildCalendarApiUrl(
  baseUrl: string,
  matchIds: string[],
): string {
  if (matchIds.length === 0) return "";
  const ids = matchIds.join(",");
  const path = `/api/calendar.ics?ids=${encodeURIComponent(ids)}`;
  return `${baseUrl.replace(/\/$/, "")}${path}`;
}

export function buildGoogleSubscribeUrl(calendarUrl: string): string {
  const webcalUrl = calendarUrl.replace(/^https?:/, "webcal:");
  return `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcalUrl)}`;
}

export function getClientBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}
