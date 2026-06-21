"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarActions, StageBreakdown } from "@/components/CalendarActions";
import { CalendarView } from "@/components/CalendarView";
import { Hero } from "@/components/Hero";
import { MatchList } from "@/components/MatchList";
import { SiteFooter } from "@/components/SiteFooter";
import { StepHeader } from "@/components/StepHeader";
import { TeamPicker } from "@/components/TeamPicker";
import { ViewToggle, type ViewMode } from "@/components/ViewToggle";
import {
  ALL_MATCHES,
  filterMatchesByTeams,
  matchInvolvesTeam,
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
    <>
      <main className="mx-auto flex min-h-full w-full max-w-4xl flex-col px-3 pb-8 pt-5 sm:px-6 sm:pb-12 sm:pt-8">
        <Hero />

        <div className="mt-8 space-y-6 sm:mt-10 sm:space-y-8">
          <TeamPicker selected={selectedTeams} onChange={setSelectedTeams} />

          <section className="surface-card rounded-2xl px-4 py-4 sm:px-5">
            <StepHeader
              step={2}
              title="Choose your matches"
              description="These are the games that will land on your calendar."
              action={<ViewToggle value={view} onChange={setView} />}
            />

            <div className="mt-4">
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
          </section>

          <CalendarActions selectedIds={selectedMatchIds} />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
