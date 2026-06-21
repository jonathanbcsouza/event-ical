"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarActions, StageBreakdown } from "@/components/CalendarActions";
import { CalendarView } from "@/components/CalendarView";
import { MatchList } from "@/components/MatchList";
import { TeamPicker } from "@/components/TeamPicker";
import { ViewToggle, type ViewMode } from "@/components/ViewToggle";
import {
  ALL_MATCHES,
  filterMatchesByTeams,
  matchInvolvesTeam,
  TOURNAMENT,
} from "@/lib/fixtures";

export function HomePage() {
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedMatchIds, setSelectedMatchIds] = useState<string[]>([]);
  const [view, setView] = useState<ViewMode>("list");

  const filteredMatches = useMemo(
    () => filterMatchesByTeams(ALL_MATCHES, selectedTeams),
    [selectedTeams],
  );

  useEffect(() => {
    if (selectedTeams.length === 0) {
      setSelectedMatchIds([]);
      return;
    }
    setSelectedMatchIds((prev) => {
      const filteredIds = new Set(filteredMatches.map((m) => m.id));
      const kept = prev.filter((id) => filteredIds.has(id));
      const autoSelect = filteredMatches
        .filter((m) =>
          selectedTeams.some((code) => matchInvolvesTeam(m, code)),
        )
        .map((m) => m.id);
      return kept.length > 0 ? kept : autoSelect;
    });
  }, [selectedTeams, filteredMatches]);

  const selectedMatches = useMemo(
    () =>
      ALL_MATCHES.filter((m) => selectedMatchIds.includes(m.id)).sort(
        (a, b) =>
          new Date(a.startUtc).getTime() - new Date(b.startUtc).getTime(),
      ),
    [selectedMatchIds],
  );

  return (
    <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col px-3 pb-32 pt-6 sm:px-6 sm:pt-8">
      <header className="mb-6 overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-emerald-50 via-white to-white p-4 dark:border-zinc-800 dark:from-emerald-950/40 dark:via-zinc-950 dark:to-zinc-950 sm:mb-8 sm:p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-600 sm:text-sm">
          {TOURNAMENT}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          Build your match calendar
        </h1>
        <p className="mt-2 max-w-xl text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
          Pick the teams you support, choose the matches you care about, then
          download or subscribe in one click.
        </p>
        <p className="mt-3 text-xs font-medium text-zinc-500 sm:text-sm">
          Jun 11 &ndash; Jul 19, 2026 &middot; United States, Canada &amp; Mexico
        </p>
      </header>

      <div className="space-y-6 sm:space-y-10">
        <TeamPicker selected={selectedTeams} onChange={setSelectedTeams} />

        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 sm:text-lg">
              {view === "list" ? "See your matches (these will all appear on your calendar!)" : "Tournament calendar"}
            </h2>
            <ViewToggle value={view} onChange={setView} />
          </div>

          {view === "list" ? (
            <div className="space-y-2">
              <MatchList
                matches={filteredMatches}
                selectedIds={selectedMatchIds}
                onSelectionChange={setSelectedMatchIds}
              />
              <StageBreakdown matches={selectedMatches} />
            </div>
          ) : (
            <div className="space-y-2">
              <CalendarView
                matches={ALL_MATCHES}
                selectedTeams={selectedTeams}
                selectedIds={selectedMatchIds}
                onSelectionChange={setSelectedMatchIds}
              />
              <StageBreakdown matches={selectedMatches} />
            </div>
          )}
        </div>
      </div>

      <CalendarActions selectedIds={selectedMatchIds} />
    </div>
  );
}
