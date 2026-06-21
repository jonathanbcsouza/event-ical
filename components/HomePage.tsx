"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarActions, StageBreakdown } from "@/components/CalendarActions";
import { MatchList } from "@/components/MatchList";
import { TeamPicker } from "@/components/TeamPicker";
import {
  ALL_MATCHES,
  filterMatchesByTeams,
  matchInvolvesTeam,
  TOURNAMENT,
} from "@/lib/fixtures";

export function HomePage() {
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedMatchIds, setSelectedMatchIds] = useState<string[]>([]);

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
    <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 pb-32 pt-8 sm:px-6">
      <header className="mb-8 space-y-2">
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-600">
          {TOURNAMENT}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Build your match calendar
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Pick the teams you support, choose the matches you care about, then
          download or subscribe in one click.
        </p>
      </header>

      <div className="space-y-10">
        <TeamPicker selected={selectedTeams} onChange={setSelectedTeams} />

        <div className="space-y-2">
          <MatchList
            matches={filteredMatches}
            selectedIds={selectedMatchIds}
            onSelectionChange={setSelectedMatchIds}
          />
          <StageBreakdown matches={selectedMatches} />
        </div>
      </div>

      <CalendarActions selectedIds={selectedMatchIds} />
    </div>
  );
}
