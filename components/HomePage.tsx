"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarActions, StageBreakdown } from "@/components/CalendarActions";
import { CalendarView } from "@/components/CalendarView";
import { Hero } from "@/components/Hero";
import { MatchList } from "@/components/MatchList";
import { SiteFooter } from "@/components/SiteFooter";
import { StepPanel } from "@/components/StepPanel";
import { TeamPicker } from "@/components/TeamPicker";
import { TimezonePicker } from "@/components/TimezonePicker";
import { ViewToggle, type ViewMode } from "@/components/ViewToggle";
import {
  ALL_MATCHES,
  filterMatchesByTeams,
} from "@/lib/fixtures";
import {
  DEFAULT_TIME_ZONE,
  detectTimeZone,
  isValidTimeZone,
} from "@/lib/timezones";

const TIME_ZONE_STORAGE_KEY = "wc2026-timezone";

export function HomePage() {
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedMatchIds, setSelectedMatchIds] = useState<string[]>([]);
  const [view, setView] = useState<ViewMode>("list");
  const [timeZone, setTimeZone] = useState(DEFAULT_TIME_ZONE);
  const [detectedTimeZone, setDetectedTimeZone] = useState(DEFAULT_TIME_ZONE);

  useEffect(() => {
    const detected = detectTimeZone();
    setDetectedTimeZone(detected);
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(TIME_ZONE_STORAGE_KEY);
    } catch {
      stored = null;
    }
    setTimeZone(stored && isValidTimeZone(stored) ? stored : detected);
  }, []);

  function handleTimeZoneChange(tz: string) {
    setTimeZone(tz);
    try {
      window.localStorage.setItem(TIME_ZONE_STORAGE_KEY, tz);
    } catch {
      // ignore persistence failures (private mode, etc.)
    }
  }

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
      return prev.filter((id) => filteredIds.has(id));
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

          <StepPanel
            step={2}
            title="Choose your matches"
            description="These are the games that will land on your calendar."
            summary={
              selectedMatchIds.length === 0
                ? "No matches selected"
                : `${selectedMatchIds.length} ${selectedMatchIds.length === 1 ? "match" : "matches"} selected`
            }
            canComplete={selectedTeams.length > 0 && selectedMatchIds.length > 0}
            pendingLabel={
              selectedTeams.length === 0
                ? "Pick teams first"
                : "Select matches"
            }
            badge={
              selectedMatchIds.length > 0 ? (
                <span className="shrink-0 rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-medium text-white">
                  {selectedMatchIds.length}
                </span>
              ) : undefined
            }
            headerAction={<ViewToggle value={view} onChange={setView} />}
          >
            <div className="mb-4 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/50">
              <TimezonePicker
                value={timeZone}
                detected={detectedTimeZone}
                onChange={handleTimeZoneChange}
              />
            </div>
            {view === "list" ? (
              <div className="space-y-2">
                <MatchList
                  matches={filteredMatches}
                  selectedIds={selectedMatchIds}
                  onSelectionChange={setSelectedMatchIds}
                  timeZone={timeZone}
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
                  timeZone={timeZone}
                />
                <StageBreakdown matches={selectedMatches} />
              </div>
            )}
          </StepPanel>

          <CalendarActions
            selectedIds={selectedMatchIds}
            timeZone={timeZone}
          />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
