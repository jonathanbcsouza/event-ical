"use client";

import { MatchRow } from "@/components/MatchRow";
import { partitionMatches, type Match } from "@/lib/fixtures";
import { Icon, Users } from "@/lib/icons";

type MatchListProps = {
  matches: Match[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  timeZone?: string;
  now?: number;
  title?: string;
  emptyMessage?: string;
  mode?: "upcoming" | "results";
};

function toggleId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
}

export function MatchList({
  matches,
  selectedIds,
  onSelectionChange,
  timeZone,
  now,
  title = "Matches",
  emptyMessage = "Select one or more teams above to see their matches.",
  mode = "upcoming",
}: MatchListProps) {
  const { upcoming, results } = partitionMatches(matches, now);
  const shown = mode === "results" ? results : upcoming;

  if (shown.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 text-center dark:border-zinc-700 dark:bg-zinc-900/50">
        <Icon icon={Users} className="mx-auto mb-3 size-8 text-zinc-400" />
        <p className="text-zinc-600 dark:text-zinc-400">{emptyMessage}</p>
      </div>
    );
  }

  if (mode === "results") {
    return (
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {title} ({shown.length})
        </h2>
        <ul className="divide-y divide-zinc-200 overflow-hidden rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {shown.map((match) => (
            <MatchRow
              key={match.id}
              match={match}
              checked={false}
              onToggle={() => {}}
              timeZone={timeZone}
              now={now}
            />
          ))}
        </ul>
      </section>
    );
  }

  const upcomingIds = upcoming.map((m) => m.id);
  const allUpcomingSelected =
    upcoming.length > 0 && upcoming.every((m) => selectedIds.includes(m.id));
  const someUpcomingSelected = upcoming.some((m) =>
    selectedIds.includes(m.id),
  );

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {title} ({shown.length})
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              onSelectionChange([
                ...new Set([...selectedIds, ...upcomingIds]),
              ])
            }
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Select all
          </button>
          <button
            type="button"
            onClick={() =>
              onSelectionChange(
                selectedIds.filter((id) => !upcomingIds.includes(id)),
              )
            }
            disabled={!someUpcomingSelected}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Clear
          </button>
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900">
        <input
          type="checkbox"
          checked={allUpcomingSelected}
          ref={(el) => {
            if (el) {
              el.indeterminate = someUpcomingSelected && !allUpcomingSelected;
            }
          }}
          onChange={() =>
            onSelectionChange(
              allUpcomingSelected
                ? selectedIds.filter((id) => !upcomingIds.includes(id))
                : [...new Set([...selectedIds, ...upcomingIds])],
            )
          }
          className="size-4 rounded border-zinc-300 accent-emerald-600"
        />
        <span className="text-zinc-700 dark:text-zinc-300">
          {upcoming.filter((m) => selectedIds.includes(m.id)).length} of{" "}
          {upcoming.length} selected for calendar
        </span>
      </label>

      <ul className="divide-y divide-zinc-200 overflow-hidden rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {shown.map((match) => (
          <MatchRow
            key={match.id}
            match={match}
            checked={selectedIds.includes(match.id)}
            onToggle={() => onSelectionChange(toggleId(selectedIds, match.id))}
            timeZone={timeZone}
            now={now}
          />
        ))}
      </ul>
    </section>
  );
}
