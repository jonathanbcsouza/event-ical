"use client";

import { Globe, Icon } from "@/lib/icons";
import {
  TIME_ZONE_GROUPS,
  ensureKnownTimeZone,
  getTimeZoneLabel,
  getTimeZoneOffsetLabel,
} from "@/lib/timezones";

type TimezonePickerProps = {
  value: string;
  detected: string;
  onChange: (tz: string) => void;
};

export function TimezonePicker({
  value,
  detected,
  onChange,
}: TimezonePickerProps) {
  const extra = ensureKnownTimeZone(value);
  const detectedExtra =
    detected !== value ? ensureKnownTimeZone(detected) : [];
  const offset = getTimeZoneOffsetLabel(value);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <label
        htmlFor="timezone-select"
        className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        <Icon icon={Globe} className="size-4 text-emerald-600" />
        Times shown in
      </label>
      <div className="flex items-center gap-2">
        <div className="relative">
          <select
            id="timezone-select"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full appearance-none rounded-lg border border-zinc-300 bg-white px-3 py-1.5 pr-8 text-sm text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 sm:w-auto"
          >
            {[...extra, ...detectedExtra].map((z) => (
              <option key={z.id} value={z.id}>
                {getTimeZoneLabel(z)}
              </option>
            ))}
            {TIME_ZONE_GROUPS.map((group) => (
              <optgroup key={group.region} label={group.region}>
                {group.zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {getTimeZoneLabel(z)}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400">
            ▾
          </span>
        </div>
        {value !== detected && (
          <button
            type="button"
            onClick={() => onChange(detected)}
            title={`Reset to your detected timezone (${getTimeZoneOffsetLabel(detected)})`}
            className="whitespace-nowrap rounded-lg border border-zinc-300 px-2 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Use my zone
          </button>
        )}
        <span className="sr-only">Current offset {offset}</span>
      </div>
    </div>
  );
}
