// Reference instant during the tournament so offset labels reflect summer DST.
const OFFSET_REFERENCE = new Date("2026-06-15T12:00:00Z");

export const DEFAULT_TIME_ZONE = "UTC";

export type TimeZoneOption = {
  id: string;
  city: string;
};

export type TimeZoneGroup = {
  region: string;
  zones: TimeZoneOption[];
};

// Curated list. World Cup 2026 host zones first, then a broad global set.
export const TIME_ZONE_GROUPS: TimeZoneGroup[] = [
  {
    region: "World Cup 2026 hosts",
    zones: [
      { id: "America/New_York", city: "Eastern (New York, Toronto)" },
      { id: "America/Chicago", city: "Central (Dallas, Kansas City)" },
      { id: "America/Denver", city: "Mountain (Denver)" },
      { id: "America/Los_Angeles", city: "Pacific (Los Angeles, Vancouver)" },
      { id: "America/Mexico_City", city: "Mexico City" },
      { id: "America/Monterrey", city: "Monterrey" },
    ],
  },
  {
    region: "Americas",
    zones: [
      { id: "America/Sao_Paulo", city: "São Paulo" },
      { id: "America/Buenos_Aires", city: "Buenos Aires" },
      { id: "America/Bogota", city: "Bogotá" },
      { id: "America/Santiago", city: "Santiago" },
      { id: "America/Lima", city: "Lima" },
      { id: "America/Halifax", city: "Halifax" },
      { id: "America/Anchorage", city: "Anchorage" },
      { id: "Pacific/Honolulu", city: "Honolulu" },
    ],
  },
  {
    region: "Europe & Africa",
    zones: [
      { id: "Europe/London", city: "London, Lisbon" },
      { id: "Europe/Madrid", city: "Madrid, Paris, Berlin" },
      { id: "Europe/Rome", city: "Rome, Amsterdam" },
      { id: "Europe/Athens", city: "Athens, Helsinki" },
      { id: "Europe/Moscow", city: "Moscow" },
      { id: "Africa/Lagos", city: "Lagos" },
      { id: "Africa/Cairo", city: "Cairo" },
      { id: "Africa/Johannesburg", city: "Johannesburg" },
    ],
  },
  {
    region: "Asia & Pacific",
    zones: [
      { id: "Asia/Dubai", city: "Dubai" },
      { id: "Asia/Riyadh", city: "Riyadh" },
      { id: "Asia/Kolkata", city: "Mumbai, Delhi" },
      { id: "Asia/Bangkok", city: "Bangkok" },
      { id: "Asia/Singapore", city: "Singapore" },
      { id: "Asia/Shanghai", city: "Beijing, Shanghai" },
      { id: "Asia/Tokyo", city: "Tokyo, Seoul" },
      { id: "Australia/Sydney", city: "Sydney" },
      { id: "Pacific/Auckland", city: "Auckland" },
    ],
  },
  {
    region: "Other",
    zones: [{ id: "UTC", city: "UTC" }],
  },
];

const ALL_ZONE_IDS = new Set(
  TIME_ZONE_GROUPS.flatMap((g) => g.zones.map((z) => z.id)),
);

export function isValidTimeZone(tz: string | null | undefined): tz is string {
  if (!tz) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export function detectTimeZone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return isValidTimeZone(tz) ? tz : DEFAULT_TIME_ZONE;
  } catch {
    return DEFAULT_TIME_ZONE;
  }
}

export function getTimeZoneOffsetLabel(
  tz: string,
  reference: Date = OFFSET_REFERENCE,
): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "shortOffset",
    }).formatToParts(reference);
    const name = parts.find((p) => p.type === "timeZoneName")?.value;
    if (!name) return "";
    return name === "GMT" ? "GMT+0" : name;
  } catch {
    return "";
  }
}

// Returns the IANA id with a friendly city label, including UTC offset.
export function getTimeZoneLabel(option: TimeZoneOption): string {
  const offset = getTimeZoneOffsetLabel(option.id);
  return offset ? `${option.city} (${offset})` : option.city;
}

export function getTimeZoneDisplayName(tz: string): string {
  const extra = ensureKnownTimeZone(tz);
  if (extra.length > 0) return getTimeZoneLabel(extra[0]);
  for (const group of TIME_ZONE_GROUPS) {
    const zone = group.zones.find((z) => z.id === tz);
    if (zone) return getTimeZoneLabel(zone);
  }
  const offset = getTimeZoneOffsetLabel(tz);
  const city = tz.replace(/_/g, " ");
  return offset ? `${city} (${offset})` : city;
}

export function ensureKnownTimeZone(tz: string): TimeZoneOption[] {
  // If the detected/selected zone isn't in the curated list, expose it so the
  // picker can still show and select it.
  if (ALL_ZONE_IDS.has(tz) || !isValidTimeZone(tz)) return [];
  return [{ id: tz, city: tz.replace(/_/g, " ") }];
}

export function formatInTimeZone(
  date: Date,
  tz: string,
  options: Intl.DateTimeFormatOptions,
): string {
  return date.toLocaleString(undefined, { ...options, timeZone: tz });
}

// Stable YYYY-MM-DD key for the given instant in the target timezone.
export function dateKeyInTimeZone(date: Date, tz: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const year = parts.find((p) => p.type === "year")?.value ?? "0000";
  const month = parts.find((p) => p.type === "month")?.value ?? "01";
  const day = parts.find((p) => p.type === "day")?.value ?? "01";
  return `${year}-${month}-${day}`;
}
