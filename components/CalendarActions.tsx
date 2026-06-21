"use client";

import { useState } from "react";
import {
  buildCalendarApiUrl,
  buildGoogleSubscribeUrl,
  getClientBaseUrl,
} from "@/lib/calendar-url";
import { countByStage, getStageLabel, type MatchStage } from "@/lib/fixtures";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Download,
  Icon,
} from "@/lib/icons";

type CalendarActionsProps = {
  selectedIds: string[];
};

export function CalendarActions({ selectedIds }: CalendarActionsProps) {
  const [showImportHelp, setShowImportHelp] = useState(false);
  const hasSelection = selectedIds.length > 0;
  const baseUrl = getClientBaseUrl();
  const calendarUrl = hasSelection
    ? buildCalendarApiUrl(baseUrl, selectedIds)
    : "";
  const googleUrl = hasSelection
    ? buildGoogleSubscribeUrl(calendarUrl)
    : "";

  return (
    <section className="sticky bottom-0 -mx-4 border-t border-zinc-200 bg-white/95 px-4 py-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95 sm:-mx-6 sm:px-6">
      <SummaryBar count={selectedIds.length} />

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <a
          href={hasSelection ? calendarUrl : undefined}
          download={hasSelection ? "world-cup-2026.ics" : undefined}
          aria-disabled={!hasSelection}
          className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
            hasSelection
              ? "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
              : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
          }`}
          onClick={(e) => {
            if (!hasSelection) e.preventDefault();
          }}
        >
          <Icon icon={Download} className="size-4" />
          Download .ics
        </a>
        <a
          href={hasSelection ? googleUrl : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!hasSelection}
          className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${
            hasSelection
              ? "border-zinc-300 text-zinc-900 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-900"
              : "cursor-not-allowed border-zinc-200 text-zinc-400 dark:border-zinc-800 dark:text-zinc-500"
          }`}
          onClick={(e) => {
            if (!hasSelection) e.preventDefault();
          }}
        >
          <Icon icon={CalendarDays} className="size-4" />
          Add to Google Calendar
        </a>
      </div>

      <button
        type="button"
        onClick={() => setShowImportHelp((v) => !v)}
        className="mt-2 inline-flex items-center gap-1 text-sm text-zinc-500 underline-offset-2 hover:text-zinc-700 hover:underline dark:hover:text-zinc-300"
      >
        <Icon
          icon={showImportHelp ? ChevronUp : ChevronDown}
          className="size-4"
        />
        {showImportHelp ? "Hide" : "How to import manually"}
      </button>

      {showImportHelp && (
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
          <li>Click &ldquo;Download .ics&rdquo; and save the file.</li>
          <li>Open Google Calendar → Settings → Import &amp; export.</li>
          <li>Select the downloaded file and choose a calendar.</li>
          <li>
            To use green in Google Calendar: find &ldquo;FIFA World Cup
            2026&rdquo; in the left sidebar → ⋮ → pick green.
          </li>
        </ol>
      )}
    </section>
  );
}

function SummaryBar({ count }: { count: number }) {
  if (count === 0) {
    return (
      <p className="text-sm text-zinc-500">
        Select matches to enable calendar export.
      </p>
    );
  }

  return (
    <p className="text-sm text-zinc-700 dark:text-zinc-300">
      <span className="font-semibold">{count}</span>{" "}
      {count === 1 ? "match" : "matches"} selected
    </p>
  );
}

export function StageBreakdown({
  matches,
}: {
  matches: { stage: MatchStage }[];
}) {
  if (matches.length === 0) return null;
  const counts = countByStage(matches as Parameters<typeof countByStage>[0]);
  const parts = (Object.entries(counts) as [MatchStage, number][])
    .filter(([, n]) => n > 0)
    .map(([stage, n]) => `${n} ${getStageLabel(stage).toLowerCase()}`);

  return (
    <p className="text-xs text-zinc-500">{parts.join(" · ")}</p>
  );
}
