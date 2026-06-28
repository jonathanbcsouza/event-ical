"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarActions, StageBreakdown } from "@/components/CalendarActions";
import { CalendarView } from "@/components/CalendarView";
import { Hero } from "@/components/Hero";
import {
  MatchBrowser,
  type MatchBrowserTab,
  type TeamScope,
} from "@/components/MatchBrowser";
import { MatchList } from "@/components/MatchList";
import { SiteFooter } from "@/components/SiteFooter";
import { StepCard } from "@/components/StepCard";
import { StepRail, type StepRailItem, type StepStatus } from "@/components/StepRail";
import { TeamPicker, TeamPickerControls, teamSummary } from "@/components/TeamPicker";
import { TimezonePicker } from "@/components/TimezonePicker";
import { ViewToggle, type ViewMode } from "@/components/ViewToggle";
import {
  filterMatchesByTeams,
  filterUpcomingMatches,
  partitionMatches,
  type Match,
} from "@/lib/fixtures";
import {
  DEFAULT_TIME_ZONE,
  detectTimeZone,
  getTimeZoneDisplayName,
  isValidTimeZone,
} from "@/lib/timezones";

const TIME_ZONE_STORAGE_KEY = "wc2026-timezone";

type HomePageProps = {
  matches: Match[];
  serverNow: number;
};

export function HomePage({ matches, serverNow }: HomePageProps) {
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedMatchIds, setSelectedMatchIds] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState(1);
  const [matchTab, setMatchTab] = useState<MatchBrowserTab>("next");
  const [teamScope, setTeamScope] = useState<TeamScope>("selected");
  const [view, setView] = useState<ViewMode>("list");
  const [timeZone, setTimeZone] = useState(DEFAULT_TIME_ZONE);
  const [detectedTimeZone, setDetectedTimeZone] = useState(DEFAULT_TIME_ZONE);
  const [now, setNow] = useState(serverNow);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);

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
      // ignore persistence failures
    }
  }

  const hasTeams = selectedTeams.length > 0;
  const useAllTeams = hasTeams && teamScope === "all";

  const scopedMatches = useMemo(
    () => (useAllTeams ? matches : filterMatchesByTeams(matches, selectedTeams)),
    [matches, selectedTeams, useAllTeams],
  );

  const { upcoming: nextMatches, results: pastMatches } = useMemo(
    () => partitionMatches(scopedMatches, now),
    [scopedMatches, now],
  );

  const upcomingTeamMatches = useMemo(
    () =>
      filterUpcomingMatches(
        filterMatchesByTeams(matches, selectedTeams),
        now,
      ),
    [matches, selectedTeams, now],
  );

  const upcomingScopedIds = useMemo(
    () => nextMatches.map((m) => m.id).join(","),
    [nextMatches],
  );

  useEffect(() => {
    if (!hasTeams) {
      setSelectedMatchIds([]);
      setTeamScope("selected");
      setActiveStep(1);
      return;
    }
    const allowedIds = new Set(
      upcomingScopedIds.split(",").filter(Boolean),
    );
    setSelectedMatchIds((prev) => prev.filter((id) => allowedIds.has(id)));
  }, [hasTeams, upcomingScopedIds]);

  const exportMatchCount = useAllTeams
    ? nextMatches.length
    : upcomingTeamMatches.length;

  const showList = view === "list" || matchTab === "past";

  function getStepStatus(step: number): StepStatus {
    if (!hasTeams && step > 1) return "locked";
    if (activeStep === step) return "active";
    if (activeStep > step) return "done";
    return "todo";
  }

  const steps: StepRailItem[] = [
    {
      n: 1,
      label: "Teams",
      summary: teamSummary(selectedTeams),
      status: getStepStatus(1),
    },
    {
      n: 2,
      label: "Timezone",
      summary: getTimeZoneDisplayName(timeZone),
      status: getStepStatus(2),
    },
    {
      n: 3,
      label: "Matches",
      summary: hasTeams
        ? `${nextMatches.length} upcoming · ${pastMatches.length} past`
        : "Pick teams first",
      status: getStepStatus(3),
    },
    {
      n: 4,
      label: "Export",
      summary: hasTeams
        ? `${exportMatchCount} ${exportMatchCount === 1 ? "match" : "matches"} live`
        : "Pick teams first",
      status: getStepStatus(4),
    },
  ];

  function goToStep(step: number) {
    if (step !== 1 && !hasTeams) return;
    setActiveStep(step);
  }

  return (
    <>
      <main className="mx-auto flex min-h-full w-full max-w-4xl flex-col px-3 pb-8 pt-5 sm:px-6 sm:pb-12 sm:pt-8">
        <Hero />

        <div className="mt-8 space-y-4 sm:mt-10 sm:space-y-5">
          <StepRail steps={steps} onSelect={goToStep} />

          {activeStep === 1 && (
            <StepCard
              step={1}
              title="Pick your teams"
              description="Choose the national teams you want to follow, or select all."
              canComplete={hasTeams}
              pendingLabel="Pick at least one team"
              doneLabel="Next"
              onDone={() => goToStep(2)}
              headerAction={
                <TeamPickerControls
                  selected={selectedTeams}
                  onChange={setSelectedTeams}
                />
              }
            >
              <TeamPicker selected={selectedTeams} onChange={setSelectedTeams} />
            </StepCard>
          )}

          {activeStep === 2 && (
            <StepCard
              step={2}
              title="Choose your timezone"
              description="Set when kickoffs and calendar events appear for you."
              canComplete={hasTeams}
              pendingLabel="Pick teams first"
              doneLabel="Next"
              onDone={() => goToStep(3)}
            >
              <TimezonePicker
                layout="step"
                value={timeZone}
                detected={detectedTimeZone}
                onChange={handleTimeZoneChange}
              />
            </StepCard>
          )}

          {activeStep === 3 && (
            <StepCard
              step={3}
              title="Choose your matches"
              description="Review upcoming games or past results."
              canComplete={hasTeams}
              pendingLabel="Pick teams first"
              doneLabel="Next"
              onDone={() => goToStep(4)}
              badge={
                (matchTab === "next" ? nextMatches : pastMatches).length > 0 ? (
                  <span className="shrink-0 rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-medium text-white">
                    {matchTab === "next" ? nextMatches.length : pastMatches.length}
                  </span>
                ) : undefined
              }
              headerAction={
                matchTab === "next" ? (
                  <ViewToggle value={view} onChange={setView} />
                ) : undefined
              }
            >
              <div className="mb-4">
                <MatchBrowser
                  activeTab={matchTab}
                  onActiveTabChange={setMatchTab}
                  teamScope={teamScope}
                  onTeamScopeChange={setTeamScope}
                  hasTeams={hasTeams}
                  nextCount={nextMatches.length}
                  pastCount={pastMatches.length}
                />
              </div>

              {showList ? (
                <div className="space-y-4">
                  {matchTab === "next" ? (
                    hasTeams ? (
                      <MatchList
                        title="Next games"
                        matches={scopedMatches}
                        mode="upcoming"
                        now={now}
                        selectedIds={selectedMatchIds}
                        onSelectionChange={setSelectedMatchIds}
                        timeZone={timeZone}
                        emptyMessage={
                          useAllTeams
                            ? "No upcoming games right now."
                            : "No upcoming games for your teams."
                        }
                      />
                    ) : (
                      <MatchList
                        matches={[]}
                        now={now}
                        selectedIds={selectedMatchIds}
                        onSelectionChange={setSelectedMatchIds}
                        timeZone={timeZone}
                      />
                    )
                  ) : hasTeams ? (
                    <MatchList
                      title="Past results"
                      matches={scopedMatches}
                      mode="results"
                      now={now}
                      selectedIds={[]}
                      onSelectionChange={() => {}}
                      timeZone={timeZone}
                      emptyMessage={
                        useAllTeams
                          ? "No results yet."
                          : "No results for your teams yet."
                      }
                    />
                  ) : (
                    <MatchList
                      matches={[]}
                      mode="results"
                      now={now}
                      selectedIds={[]}
                      onSelectionChange={() => {}}
                      timeZone={timeZone}
                      emptyMessage="Pick teams above to see results."
                    />
                  )}

                  <StageBreakdown
                    matches={matchTab === "next" ? nextMatches : pastMatches}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <CalendarView
                    matches={matches}
                    selectedTeams={selectedTeams}
                    selectedIds={selectedMatchIds}
                    onSelectionChange={setSelectedMatchIds}
                    timeZone={timeZone}
                    now={now}
                  />
                  <StageBreakdown matches={nextMatches} />
                </div>
              )}
            </StepCard>
          )}

          {activeStep === 4 && (
            <StepCard
              step={4}
              title="Export your calendar"
              description={
                hasTeams
                  ? "Subscribe for a live feed — knockout opponents fill in as your teams advance."
                  : "Pick teams first."
              }
              canComplete={hasTeams}
              isLastStep
              badge={
                hasTeams ? (
                  <span className="shrink-0 rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-medium text-white">
                    {exportMatchCount}
                  </span>
                ) : undefined
              }
            >
              <CalendarActions
                selectedTeams={selectedTeams}
                selectedIds={selectedMatchIds}
                includeAllTeams={useAllTeams}
                matchCount={exportMatchCount}
                timeZone={timeZone}
              />
            </StepCard>
          )}
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
