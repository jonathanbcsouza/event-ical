"use client";

import { getTeamsByGroup, type TeamRef } from "@/lib/fixtures";
import { getFlag } from "@/lib/flags";

type TeamPickerProps = {
  selected: string[];
  onChange: (codes: string[]) => void;
};

function toggleTeam(selected: string[], code: string): string[] {
  return selected.includes(code)
    ? selected.filter((c) => c !== code)
    : [...selected, code];
}

export function TeamPicker({ selected, onChange }: TeamPickerProps) {
  const groups = getTeamsByGroup();

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Teams you cheer for
        </h2>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-sm text-zinc-500 underline-offset-2 hover:text-zinc-800 hover:underline dark:hover:text-zinc-200"
          >
            Clear all
          </button>
        )}
      </div>
      <div className="space-y-5">
        {groups.map(({ group, teams }) => (
          <div key={group}>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
              Group {group}
            </p>
            <div className="flex flex-wrap gap-2">
              {teams.map((team) => (
                <TeamChip
                  key={team.code}
                  team={team}
                  active={selected.includes(team.code)}
                  onToggle={() => onChange(toggleTeam(selected, team.code))}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TeamChip({
  team,
  active,
  onToggle,
}: {
  team: TeamRef;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "border-emerald-600 bg-emerald-600 text-white"
          : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-500"
      }`}
    >
      <span aria-hidden className="text-base leading-none">
        {getFlag(team.code)}
      </span>
      {team.name}
    </button>
  );
}
