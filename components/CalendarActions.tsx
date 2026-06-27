"use client";

import { useEffect, useState } from "react";
import { DonatePrompt } from "@/components/DonatePrompt";
import { StepPanel } from "@/components/StepPanel";
import {
  buildAppleSubscribeUrl,
  buildCalendarApiUrl,
  buildGoogleAndroidIntentUrl,
  buildGoogleSubscribeUrl,
  buildOutlookSubscribeUrl,
  buildOutlookOfficeSubscribeUrl,
  getClientBaseUrl,
  ICS_FILENAME,
} from "@/lib/calendar-url";
import { getMobilePlatform, type MobilePlatform } from "@/lib/device";
import {
  countByStage,
  getStageLabel,
  type MatchStage,
} from "@/lib/fixtures";
import { getTimeZoneOffsetLabel } from "@/lib/timezones";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Download,
  Globe,
  Icon,
  Mail,
} from "@/lib/icons";
import { cn } from "@/lib/utils";

type CalendarActionsProps = {
  selectedTeams: string[];
  selectedIds: string[];
  includeAllTeams: boolean;
  matchCount: number;
  timeZone?: string;
};

type ExportAction = {
  id: "google" | "outlook" | "apple" | "download";
  label: string;
  title: string;
  icon: typeof CalendarDays | typeof Download | typeof Mail;
  variant: "primary" | "secondary";
  enabled: boolean;
  href?: string;
  download?: string;
  openInNewTab?: boolean;
};

export function CalendarActions({
  selectedTeams,
  selectedIds,
  includeAllTeams,
  matchCount,
  timeZone,
}: CalendarActionsProps) {
  const [showImportHelp, setShowImportHelp] = useState(false);
  const [mobilePlatform, setMobilePlatform] = useState<MobilePlatform | null>(
    null,
  );

  useEffect(() => {
    setMobilePlatform(getMobilePlatform());
  }, []);

  const canSubscribe = selectedTeams.length > 0;
  const canDownload = selectedIds.length > 0;

  const baseUrl = getClientBaseUrl();
  const subscribeUrl = canSubscribe
    ? buildCalendarApiUrl(baseUrl, {
        ...(includeAllTeams
          ? { includeAll: true }
          : { teamCodes: selectedTeams }),
        timeZone,
      })
    : "";
  const downloadUrl = canDownload
    ? buildCalendarApiUrl(baseUrl, {
        matchIds: selectedIds,
        timeZone,
        download: true,
      })
    : "";

  const googleWebUrl = subscribeUrl
    ? buildGoogleSubscribeUrl(subscribeUrl)
    : "";
  const googleUrl =
    mobilePlatform === "android" && subscribeUrl
      ? buildGoogleAndroidIntentUrl(subscribeUrl)
      : googleWebUrl;
  const outlookUrl = subscribeUrl
    ? buildOutlookSubscribeUrl(subscribeUrl)
    : "";
  const outlookOfficeUrl = subscribeUrl
    ? buildOutlookOfficeSubscribeUrl(subscribeUrl)
    : "";
  const appleUrl = subscribeUrl ? buildAppleSubscribeUrl(subscribeUrl) : "";
  const isMobile = mobilePlatform !== null;

  const exportActions: ExportAction[] = [
    {
      id: "google",
      label: "Add to Google Calendar",
      title: isMobile
        ? "Opens Google Calendar app when installed, otherwise the mobile site"
        : "Subscribe in Google Calendar — knockout teams update automatically as results come in",
      icon: CalendarDays,
      variant: "primary",
      enabled: canSubscribe,
      href: googleUrl,
      openInNewTab: !isMobile,
    },
    {
      id: "outlook",
      label: "Add to Outlook",
      title: isMobile
        ? "Opens Outlook app or mobile web to subscribe — syncs to the app after you confirm"
        : "Subscribe in Outlook on the web — knockout teams update automatically as results come in",
      icon: Mail,
      variant: "secondary",
      enabled: canSubscribe,
      href: outlookUrl,
      openInNewTab: !isMobile,
    },
    ...(mobilePlatform === "ios"
      ? [
          {
            id: "apple" as const,
            label: "Add to Apple Calendar",
            title:
              "Opens Apple Calendar directly on iPhone/iPad to subscribe to the live feed",
            icon: CalendarDays,
            variant: "secondary" as const,
            enabled: canSubscribe,
            href: appleUrl,
            openInNewTab: false,
          },
        ]
      : []),
    {
      id: "download",
      label: "Download .ics",
      title:
        "Download a one-time snapshot of your selected matches",
      icon: Download,
      variant: "secondary",
      enabled: canDownload,
      href: downloadUrl,
      download: ICS_FILENAME,
    },
  ];

  return (
    <StepPanel
      step={3}
      title="Export your calendar"
      description={
        canSubscribe
          ? "Subscribe for a live feed — knockout opponents fill in as your teams advance."
          : "Pick teams in step 2 first."
      }
      summary={
        canSubscribe
          ? `${matchCount} upcoming ${matchCount === 1 ? "match" : "matches"} in your live feed`
          : "Pick teams in step 2 first"
      }
      canComplete={canSubscribe}
      pendingLabel="Complete step 2"
      badge={
        canSubscribe ? (
          <span className="shrink-0 rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-medium text-white">
            {matchCount}
          </span>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {exportActions.map((action) => (
          <ExportButton key={action.id} action={action} />
        ))}
      </div>

      {canSubscribe && (
        <p className="mt-3 text-xs text-zinc-500">
          {includeAllTeams
            ? "Your subscription includes all upcoming games. Download .ics uses your checked games only."
            : "Your subscription follows the teams you picked through the bracket. Download .ics uses checked games only."}{" "}
          Past games show scores only.
        </p>
      )}

      {canSubscribe && <DonatePrompt matchCount={matchCount} />}

      {canSubscribe && isMobile && (
        <p className="mt-3 text-xs text-zinc-500">
          On mobile, links open your calendar app when installed. Google and
          Outlook may still use the browser to confirm the subscription — it
          then syncs to the app.
        </p>
      )}

      {canSubscribe && timeZone && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-zinc-500">
          <Icon icon={Globe} className="size-3.5" />
          Events use {timeZone.replace(/_/g, " ")}
          {getTimeZoneOffsetLabel(timeZone)
            ? ` (${getTimeZoneOffsetLabel(timeZone)})`
            : ""}
          . Change the timezone in step 2.
        </p>
      )}

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
            calendar app. Knockout match names update as teams are confirmed.
          </li>
          <li>
            On mobile, Google and Outlook links try to open the native app.
            If nothing happens, use Download .ics or subscribe from a desktop
            browser — it syncs to your phone afterward.
          </li>
          <li>
            If Outlook says &ldquo;Couldn&apos;t import calendar&rdquo;, use
            &ldquo;Download .ics&rdquo; and Add calendar → Upload from file
            (Microsoft&apos;s documented fallback).
          </li>
          <li>
            Work or school account?{" "}
            {canSubscribe ? (
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
      target={action.openInNewTab ? "_blank" : undefined}
      rel={action.openInNewTab ? "noopener noreferrer" : undefined}
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
