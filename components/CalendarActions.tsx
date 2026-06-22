"use client";

import { useState } from "react";
import { StepPanel } from "@/components/StepPanel";
import {
  buildCalendarApiUrl,
  buildGoogleSubscribeUrl,
  buildOutlookSubscribeUrl,
  buildOutlookOfficeSubscribeUrl,
  getClientBaseUrl,
  ICS_FILENAME,
} from "@/lib/calendar-url";
import { countByStage, getStageLabel, type MatchStage } from "@/lib/fixtures";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Download,
  Icon,
  Mail,
} from "@/lib/icons";
import { cn } from "@/lib/utils";

type CalendarActionsProps = {
  selectedIds: string[];
};

type ExportAction = {
  id: "google" | "outlook" | "download";
  label: string;
  title: string;
  icon: typeof CalendarDays | typeof Download | typeof Mail;
  variant: "primary" | "secondary";
  enabled: boolean;
  href?: string;
  download?: string;
  external?: boolean;
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
  const outlookUrl = hasSelection
    ? buildOutlookSubscribeUrl(calendarUrl)
    : "";
  const outlookOfficeUrl = hasSelection
    ? buildOutlookOfficeSubscribeUrl(calendarUrl)
    : "";

  const exportActions: ExportAction[] = [
    {
      id: "google",
      label: "Add to Google Calendar",
      title:
        "Subscribe in Google Calendar — your selected matches stay up to date automatically",
      icon: CalendarDays,
      variant: "primary",
      enabled: hasSelection,
      href: googleUrl,
      external: true,
    },
    {
      id: "outlook",
      label: "Add to Outlook",
      title:
        "Subscribe in Outlook on the web — opens Outlook to add this calendar from the internet",
      icon: Mail,
      variant: "secondary",
      enabled: hasSelection,
      href: outlookUrl,
      external: true,
    },
    {
      id: "download",
      label: "Download .ics",
      title:
        "Download a one-time .ics file for Apple Calendar or manual import",
      icon: Download,
      variant: "secondary",
      enabled: hasSelection,
      href: `${calendarUrl}&download=1`,
      download: ICS_FILENAME,
    },
  ];

  return (
    <StepPanel
      step={3}
      title="Export your calendar"
      description={
        hasSelection
          ? "Subscribe in Google or Outlook, or download a file for Apple Calendar."
          : "Complete step 2 to choose which matches to export."
      }
      summary={
        hasSelection
          ? `${selectedIds.length} ${selectedIds.length === 1 ? "match" : "matches"} ready to export`
          : "Select matches in step 2 first"
      }
      canComplete={hasSelection}
      pendingLabel="Complete step 2"
      badge={
        hasSelection ? (
          <span className="shrink-0 rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-medium text-white">
            {selectedIds.length}
          </span>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {exportActions.map((action) => (
          <ExportButton key={action.id} action={action} />
        ))}
      </div>

      <button
        type="button"
        onClick={() => setShowImportHelp((v) => !v)}
        className="mt-3 inline-flex items-center gap-1 text-sm text-zinc-500 underline-offset-2 hover:text-zinc-700 hover:underline dark:hover:text-zinc-300"
      >
        <Icon
          icon={showImportHelp ? ChevronUp : ChevronDown}
          className="size-4"
        />
        {showImportHelp ? "Hide" : "How to import manually"}
      </button>

      {showImportHelp && (
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
          <li>
            Google and Outlook subscribe to a live feed — confirm once in your
            calendar app. Outlook refreshes subscribed calendars every few hours.
          </li>
          <li>
            If Outlook says &ldquo;Couldn&apos;t import calendar&rdquo;, use
            &ldquo;Download .ics&rdquo; and Add calendar → Upload from file
            (Microsoft&apos;s documented fallback).
          </li>
          <li>
            Work or school account?{" "}
            {hasSelection ? (
              <a
                href={outlookOfficeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Use this Microsoft 365 subscribe link
              </a>
            ) : (
              "use the Microsoft 365 subscribe link"
            )}{" "}
            instead, or download the .ics and use File → Open &amp; Import.
          </li>
          <li>
            To use green in Google Calendar: find &ldquo;FIFA World Cup
            2026&rdquo; in the left sidebar → ⋮ → pick green.
          </li>
        </ol>
      )}
    </StepPanel>
  );
}

function ExportButton({ action }: { action: ExportAction }) {
  const className = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors",
    action.enabled
      ? action.variant === "primary"
        ? "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        : "border border-zinc-300 text-zinc-900 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-900"
      : "cursor-not-allowed border border-zinc-200 bg-zinc-100 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-500",
  );

  if (!action.enabled) {
    return (
      <span aria-disabled title={action.title} className={className}>
        <Icon icon={action.icon} className="size-4" />
        {action.label}
      </span>
    );
  }

  return (
    <a
      href={action.href}
      download={action.download}
      target={action.external ? "_blank" : undefined}
      rel={action.external ? "noopener noreferrer" : undefined}
      title={action.title}
      className={className}
    >
      <Icon icon={action.icon} className="size-4" />
      {action.label}
    </a>
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
