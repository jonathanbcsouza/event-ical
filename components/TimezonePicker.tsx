"use client";

import { useTranslations } from "next-intl";
import { Globe, Icon } from "@/lib/icons";
import {
  TIME_ZONE_GROUPS,
  ensureKnownTimeZone,
  getTimeZoneLabel,
  getTimeZoneOffsetLabel,
} from "@/lib/timezones";
import { cn } from "@/lib/utils";

const REGION_KEYS: Record<string, string> = {
  "World Cup 2026 hosts": "hosts",
  Americas: "americas",
  "Europe & Africa": "europeAfrica",
  "Asia & Pacific": "asiaPacific",
  Other: "other",
};

type TimezonePickerProps = {
  value: string;
  detected: string;
  onChange: (tz: string) => void;
  layout?: "inline" | "step";
};

export function TimezonePicker({
  value,
  detected,
  onChange,
  layout = "inline",
}: TimezonePickerProps) {
  const t = useTranslations("timezone");

  const extra = ensureKnownTimeZone(value);
  const detectedExtra =
    detected !== value ? ensureKnownTimeZone(detected) : [];
  const offset = getTimeZoneOffsetLabel(value);
  const detectedLabel = getTimeZoneOffsetLabel(detected);

  const select = (
    <div className="relative">
      <select
        id="timezone-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full appearance-none rounded-lg border border-zinc-300 bg-white text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
          layout === "step"
            ? "px-4 py-3 pr-10 text-base"
            : "px-3 py-1.5 pr-8 text-sm sm:w-auto",
        )}
      >
        {[...extra, ...detectedExtra].map((z) => (
          <option key={z.id} value={z.id}>
            {getTimeZoneLabel(z)}
          </option>
        ))}
        {TIME_ZONE_GROUPS.map((group) => (
          <optgroup
            key={group.region}
            label={t(`regions.${REGION_KEYS[group.region] ?? "other"}`)}
          >
            {group.zones.map((z) => (
              <option key={z.id} value={z.id}>
                {getTimeZoneLabel(z)}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
        ▾
      </span>
    </div>
  );

  if (layout === "step") {
    return (
      <div className="mx-auto max-w-md space-y-5">
        <div className="text-center">
          <span className="inline-flex size-12 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
            <Icon icon={Globe} className="size-6" />
          </span>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            {t("stepHint")}
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="timezone-select"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            {t("yourTimezone")}
          </label>
          {select}
          <p className="text-xs text-zinc-500">
            {t("currentlyOffset", { offset: offset || "UTC" })}
          </p>
        </div>

        {value !== detected && (
          <button
            type="button"
            onClick={() => onChange(detected)}
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            {t("useMyTimezone")}
            {detectedLabel ? ` (${detectedLabel})` : ""}
          </button>
        )}
        <span className="sr-only">{t("currentOffset", { offset })}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <label
        htmlFor="timezone-select"
        className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        <Icon icon={Globe} className="size-4 text-emerald-600" />
        {t("timesShownIn")}
      </label>
      <div className="flex items-center gap-2">
        {select}
        {value !== detected && (
          <button
            type="button"
            onClick={() => onChange(detected)}
            title={t("resetDetected", { label: detectedLabel })}
            className="whitespace-nowrap rounded-lg border border-zinc-300 px-2 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {t("useMyZone")}
          </button>
        )}
        <span className="sr-only">{t("currentOffset", { offset })}</span>
      </div>
    </div>
  );
}
