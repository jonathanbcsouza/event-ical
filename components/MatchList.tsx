"use client";

import { MatchRow } from "@/components/MatchRow";
import { type Match } from "@/lib/fixtures";
import { Icon, Users } from "@/lib/icons";

type MatchListProps = {
  matches: Match[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  timeZone?: string;
};

function toggleId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
}

export function MatchList({
  matches,
  selectedIds,
  onSelectionChange,
  timeZone,
}: MatchListProps) {
  if (matches.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 text-center dark:border-zinc-700 dark:bg-zinc-900/50">
        <Icon
          icon={Users}
          className="mx-auto mb-3 size-8 text-zinc-400"
        />
        <p className="text-zinc-600 dark:text-zinc-400">
          Select one or more teams above to see their matches.
        </p>
      </div>
    );
  }

  const allSelected = matches.every((m) => selectedIds.includes(m.id));
  const someSelected = matches.some((m) => selectedIds.includes(m.id));

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Matches ({matches.length})
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onSelectionChange(matches.map((m) => m.id))}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Select all
          </button>
          <button
            type="button"
            onClick={() => onSelectionChange([])}
            disabled={!someSelected}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Clear
          </button>
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900">
        <input
          type="checkbox"
          checked={allSelected}
          ref={(el) => {
            if (el) el.indeterminate = someSelected && !allSelected;
          }}
          onChange={() =>
            onSelectionChange(allSelected ? [] : matches.map((m) => m.id))
          }
          className="size-4 rounded border-zinc-300 accent-emerald-600"
        />
        <span className="text-zinc-700 dark:text-zinc-300">
          {selectedIds.length} of {matches.length} selected
        </span>
      </label>

      <ul className="divide-y divide-zinc-200 overflow-hidden rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {matches.map((match) => (
          <MatchRow
            key={match.id}
            match={match}
            checked={selectedIds.includes(match.id)}
            onToggle={() => onSelectionChange(toggleId(selectedIds, match.id))}
            timeZone={timeZone}
          />
        ))}
      </ul>
    </section>
  );
}
