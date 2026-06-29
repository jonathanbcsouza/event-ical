"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export type MatchBrowserTab = "next" | "past";
export type TeamScope = "selected" | "all";

type MatchBrowserProps = {
  activeTab: MatchBrowserTab;
  onActiveTabChange: (tab: MatchBrowserTab) => void;
  teamScope: TeamScope;
  onTeamScopeChange: (scope: TeamScope) => void;
  hasTeams: boolean;
  nextCount: number;
  pastCount: number;
};

export function MatchBrowser({
  activeTab,
  onActiveTabChange,
  teamScope,
  onTeamScopeChange,
  hasTeams,
  nextCount,
  pastCount,
}: MatchBrowserProps) {
  const t = useTranslations("matchBrowser");

  const helperText =
    activeTab === "next"
      ? !hasTeams
        ? t("pickTeamsUpcoming")
        : teamScope === "all"
          ? t("allUpcoming")
          : t("teamUpcoming")
      : !hasTeams
        ? t("pickTeamsPast")
        : teamScope === "all"
          ? t("allPast")
          : t("teamPast");

  return (
    <section className="space-y-3">
      <div className="flex rounded-xl border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-700 dark:bg-zinc-900/50">
        <TabButton
          active={activeTab === "next"}
          onClick={() => onActiveTabChange("next")}
          label={t("nextGames")}
          count={nextCount}
        />
        <TabButton
          active={activeTab === "past"}
          onClick={() => onActiveTabChange("past")}
          label={t("pastResults")}
          count={pastCount}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={!hasTeams}
          onClick={() => onTeamScopeChange("selected")}
          className={cn(
            scopeButtonClass(teamScope === "selected"),
            !hasTeams && "opacity-40",
          )}
        >
          {t("selectedTeamsOnly")}
        </button>
        <button
          type="button"
          onClick={() => onTeamScopeChange("all")}
          className={scopeButtonClass(teamScope === "all")}
        >
          {t("includeAllTeams")}
        </button>
      </div>

      <p className="text-xs text-zinc-500">{helperText}</p>
    </section>
  );
}

function scopeButtonClass(active: boolean) {
  return cn(
    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed",
    active
      ? "border-transparent bg-emerald-100 text-emerald-800 ring-2 ring-emerald-500/40 dark:bg-emerald-950 dark:text-emerald-300"
      : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800",
  );
}

function TabButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50"
          : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300",
      )}
    >
      {label}
      {count > 0 && (
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 text-xs tabular-nums",
            active
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
              : "bg-zinc-200/80 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
