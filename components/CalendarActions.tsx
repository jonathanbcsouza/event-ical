"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { DonatePrompt } from "@/components/DonatePrompt";
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
  const t = useTranslations("calendarActions");
  const tStages = useTranslations("stages");

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
  const googleSubscribeUrl = canSubscribe
    ? buildCalendarApiUrl(baseUrl, {
        ...(includeAllTeams
          ? { includeAll: true }
          : { teamCodes: selectedTeams }),
        timeZone,
        client: "google",
      })
    : "";
  const outlookSubscribeUrl = canSubscribe
    ? buildCalendarApiUrl(baseUrl, {
        ...(includeAllTeams
          ? { includeAll: true }
          : { teamCodes: selectedTeams }),
        timeZone,
        client: "outlook",
      })
    : "";
  const downloadUrl = canDownload
    ? buildCalendarApiUrl(baseUrl, {
        matchIds: selectedIds,
        timeZone,
        download: true,
        client: "outlook",
      })
    : "";

  const googleWebUrl = googleSubscribeUrl
    ? buildGoogleSubscribeUrl(googleSubscribeUrl)
    : "";
  const googleUrl =
    mobilePlatform === "android" && googleSubscribeUrl
      ? buildGoogleAndroidIntentUrl(googleSubscribeUrl)
      : googleWebUrl;
  const outlookUrl = outlookSubscribeUrl
    ? buildOutlookSubscribeUrl(outlookSubscribeUrl)
    : "";
  const outlookOfficeUrl = outlookSubscribeUrl
    ? buildOutlookOfficeSubscribeUrl(outlookSubscribeUrl)
    : "";
  const appleUrl = outlookSubscribeUrl
    ? buildAppleSubscribeUrl(outlookSubscribeUrl)
    : "";
  const isMobile = mobilePlatform !== null;

  const exportActions: ExportAction[] = [
    {
      id: "google",
      label: t("google"),
      title: isMobile ? t("googleTitleMobile") : t("googleTitleDesktop"),
      icon: CalendarDays,
      variant: "primary",
      enabled: canSubscribe,
      href: googleUrl,
      openInNewTab: !isMobile,
    },
    {
      id: "outlook",
      label: t("outlook"),
      title: isMobile ? t("outlookTitleMobile") : t("outlookTitleDesktop"),
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
            label: t("apple"),
            title: t("appleTitle"),
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
      label: t("download"),
      title: t("downloadTitle"),
      icon: Download,
      variant: "secondary",
      enabled: canDownload,
      href: downloadUrl,
      download: ICS_FILENAME,
    },
  ];

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {exportActions.map((action) => (
          <ExportButton key={action.id} action={action} />
        ))}
      </div>

      {canSubscribe && (
        <p className="mt-3 text-xs text-zinc-500">
          {includeAllTeams ? t("subscribeAllHint") : t("subscribeTeamsHint")}{" "}
          {t("pastScoresHint")}
        </p>
      )}

      {canSubscribe && <DonatePrompt matchCount={matchCount} />}

      {canSubscribe && isMobile && (
        <p className="mt-3 text-xs text-zinc-500">{t("mobileHint")}</p>
      )}

      {canSubscribe && timeZone && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-zinc-500">
          <Icon icon={Globe} className="size-3.5" />
          {t("eventsUseTimezone", {
            timezone: timeZone.replace(/_/g, " "),
            offset: getTimeZoneOffsetLabel(timeZone)
              ? ` (${getTimeZoneOffsetLabel(timeZone)})`
              : "",
          })}
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
        {showImportHelp ? t("hideHelp") : t("showHelp")}
      </button>

      {showImportHelp && (
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
          <li>{t("help1")}</li>
          <li>{t("help2")}</li>
          <li>{t("help3")}</li>
          <li>
            {t.rich("help4Work", {
              link: () =>
                canSubscribe ? (
                  <a
                    href={outlookOfficeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2"
                  >
                    {t("help4Link")}
                  </a>
                ) : (
                  t("help4Plain")
                ),
            })}
          </li>
          <li>{t("help5")}</li>
        </ol>
      )}
    </div>
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
  const t = useTranslations("calendarActions");
  const tStages = useTranslations("stages");

  if (matches.length === 0) return null;
  const counts = countByStage(matches as Parameters<typeof countByStage>[0]);
  const parts = (Object.entries(counts) as [MatchStage, number][])
    .filter(([, n]) => n > 0)
    .map(([stage, n]) =>
      t("stageCount", {
        count: n,
        stage: tStages(stage).toLowerCase(),
      }),
    );

  return (
    <p className="text-xs text-zinc-500">{parts.join(" · ")}</p>
  );
}
