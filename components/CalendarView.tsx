"use client";

import { useMemo, useState } from "react";
import { MatchRow } from "@/components/MatchRow";
import { getFlag } from "@/lib/flags";
import {
  getStageColor,
  getStageLabel,
  matchInvolvesTeam,
  type Match,
  type MatchStage,
} from "@/lib/fixtures";
import { dateKeyInTimeZone } from "@/lib/timezones";

type CalendarViewProps = {
  matches: Match[];
  selectedTeams: string[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  timeZone?: string;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const LEGEND_STAGES: MatchStage[] = ["group", "r32", "r16", "qf", "sf", "final"];

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

function matchDateKey(match: Match, timeZone?: string): string {
  const date = new Date(match.startUtc);
  return timeZone ? dateKeyInTimeZone(date, timeZone) : dateKey(date);
}

function toggleId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
}

type MonthGrid = {
  year: number;
  month: number;
  label: string;
  cells: (Date | null)[];
};

function buildMonths(matches: Match[], timeZone?: string): MonthGrid[] {
  if (matches.length === 0) return [];
  // Derive the visible month range from match dates in the selected timezone so
  // the grid lines up with how matches are bucketed.
  const keys = matches.map((m) => matchDateKey(m, timeZone)).sort();
  const [minYear, minMonth] = keys[0].split("-").map(Number);
  const [maxYear, maxMonth] = keys[keys.length - 1].split("-").map(Number);

  const months: MonthGrid[] = [];
  const cursor = new Date(minYear, minMonth - 1, 1);
  const last = new Date(maxYear, maxMonth - 1, 1);

  while (cursor <= last) {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);

    months.push({
      year,
      month,
      label: new Date(year, month, 1).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      }),
      cells,
    });
    cursor.setMonth(month + 1);
  }
  return months;
}

export function CalendarView({
  matches,
  selectedTeams,
  selectedIds,
  onSelectionChange,
  timeZone,
}: CalendarViewProps) {
  const matchesByDay = useMemo(() => {
    const map = new Map<string, Match[]>();
    for (const m of matches) {
      const key = matchDateKey(m, timeZone);
      const list = map.get(key);
      if (list) list.push(m);
      else map.set(key, [m]);
    }
    for (const list of map.values()) {
      list.sort(
        (a, b) =>
          new Date(a.startUtc).getTime() - new Date(b.startUtc).getTime(),
      );
    }
    return map;
  }, [matches, timeZone]);

  const months = useMemo(
    () => buildMonths(matches, timeZone),
    [matches, timeZone],
  );
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const [openDay, setOpenDay] = useState<string | null>(null);
  const openDayMatches = openDay ? (matchesByDay.get(openDay) ?? []) : [];

  function dayInvolvesSelectedTeam(dayMatches: Match[]): boolean {
    if (selectedTeams.length === 0) return false;
    return dayMatches.some((m) =>
      selectedTeams.some((code) => matchInvolvesTeam(m, code)),
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {LEGEND_STAGES.map((stage) => (
          <span
            key={stage}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500"
          >
            <span
              className={`size-2.5 rounded-full ${getStageColor(stage).dot}`}
            />
            {getStageLabel(stage)}
          </span>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {months.map((m) => (
          <div key={`${m.year}-${m.month}`}>
            <h3 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {m.label}
            </h3>
            <div className="grid grid-cols-7 gap-1">
              {WEEKDAYS.map((w) => (
                <div
                  key={w}
                  className="py-1 text-center text-[11px] font-medium uppercase tracking-wide text-zinc-400"
                >
                  {w}
                </div>
              ))}
              {m.cells.map((cell, i) => {
                if (!cell) return <div key={i} className="aspect-square" />;
                const key = dateKey(cell);
                const dayMatches = matchesByDay.get(key) ?? [];
                const hasMatches = dayMatches.length > 0;
                const selectedHere = dayMatches.some((mt) =>
                  selectedSet.has(mt.id),
                );
                const teamHighlight = dayInvolvesSelectedTeam(dayMatches);
                const isOpen = openDay === key;

                return (
                  <button
                    key={i}
                    type="button"
                    disabled={!hasMatches}
                    onClick={() => setOpenDay(isOpen ? null : key)}
                    aria-pressed={isOpen}
                    className={`flex aspect-square flex-col items-center gap-1 rounded-lg border p-1 text-left transition-colors ${
                      hasMatches
                        ? "cursor-pointer hover:border-emerald-400"
                        : "cursor-default opacity-50"
                    } ${
                      isOpen
                        ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40"
                        : selectedHere
                          ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/20"
                          : teamHighlight
                            ? "border-emerald-300 dark:border-emerald-800"
                            : "border-zinc-200 dark:border-zinc-800"
                    }`}
                  >
                    <span
                      className={`text-xs font-medium ${
                        selectedHere || isOpen
                          ? "text-emerald-700 dark:text-emerald-300"
                          : "text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      {cell.getDate()}
                    </span>
                    {hasMatches && (
                      <DayIndicators
                        dayMatches={dayMatches}
                        selectedTeams={selectedTeams}
                        selectedSet={selectedSet}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {openDay && (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {new Date(openDay + "T12:00:00").toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}{" "}
              <span className="font-normal text-zinc-400">
                ({openDayMatches.length}{" "}
                {openDayMatches.length === 1 ? "match" : "matches"})
              </span>
            </h3>
            <button
              type="button"
              onClick={() =>
                onSelectionChange(
                  Array.from(
                    new Set([
                      ...selectedIds,
                      ...openDayMatches.map((mt) => mt.id),
                    ]),
                  ),
                )
              }
              className="rounded-lg border border-zinc-200 px-3 py-1 text-xs text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Add all
            </button>
          </div>
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {openDayMatches.map((match) => (
              <MatchRow
                key={match.id}
                match={match}
                checked={selectedSet.has(match.id)}
                onToggle={() =>
                  onSelectionChange(toggleId(selectedIds, match.id))
                }
                showDate={false}
                timeZone={timeZone}
              />
            ))}
          </ul>
        </div>
      )}

      {!openDay && (
        <p className="text-center text-sm text-zinc-400">
          Tap a highlighted day to see and select its matches.
        </p>
      )}
    </section>
  );
}

function DayIndicators({
  dayMatches,
  selectedTeams,
  selectedSet,
}: {
  dayMatches: Match[];
  selectedTeams: string[];
  selectedSet: Set<string>;
}) {
  const MAX = 3;
  const shown = dayMatches.slice(0, MAX);
  const extra = dayMatches.length - shown.length;

  return (
    <span className="flex flex-wrap items-center justify-center gap-0.5">
      {shown.map((m) => {
        const selectedTeamCode = selectedTeams.find((code) =>
          matchInvolvesTeam(m, code),
        );
        if (selectedTeamCode) {
          return (
            <span key={m.id} aria-hidden className="text-[10px] leading-none">
              {getFlag(selectedTeamCode)}
            </span>
          );
        }
        return (
          <span
            key={m.id}
            className={`size-1.5 rounded-full ${getStageColor(m.stage).dot} ${
              selectedSet.has(m.id) ? "ring-1 ring-emerald-600" : ""
            }`}
          />
        );
      })}
      {extra > 0 && (
        <span className="text-[9px] font-medium text-zinc-400">+{extra}</span>
      )}
    </span>
  );
}
