"use client";

import { StepHeader } from "@/components/StepHeader";
import { getTeamsByGroup, type TeamRef } from "@/lib/fixtures";
import { getFlag } from "@/lib/flags";

type TeamPickerProps = {
  selected: string[];
  onChange: (codes: string[]) => void;
};

const SHORT_NAMES: Record<string, string> = {
  "Bosnia and Herzegovina": "Bosnia",
  "Czech Republic": "Czechia",
  "South Africa": "S. Africa",
  "South Korea": "S. Korea",
  "Ivory Coast": "Ivory Coast",
  "New Zealand": "N. Zealand",
  "Saudi Arabia": "Saudi",
  "DR Congo": "DR Congo",
};

function toggleTeam(selected: string[], code: string): string[] {
  return selected.includes(code)
    ? selected.filter((c) => c !== code)
    : [...selected, code];
}

function displayName(name: string, compact: boolean): string {
  if (!compact) return name;
  return SHORT_NAMES[name] ?? name;
}

export function TeamPicker({ selected, onChange }: TeamPickerProps) {
  const groups = getTeamsByGroup();

  return (
    <section className="surface-card rounded-2xl px-4 py-4 sm:px-5">
      <StepHeader
        step={1}
        title="Pick your teams"
        description="Tap the nations you want to follow."
        badge={
          selected.length > 0 ? (
            <span className="shrink-0 rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-medium text-white">
              {selected.length}
            </span>
          ) : undefined
        }
        action={
          selected.length > 0 ? (
            <button
              type="button"
              onClick={() => onChange([])}
              className="shrink-0 py-1 text-xs text-zinc-500 underline-offset-2 hover:text-zinc-800 hover:underline dark:hover:text-zinc-200"
            >
              Clear all
            </button>
          ) : undefined
        }
      />

      <div className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800">
        {groups.map(({ group, teams }) => (
          <div
            key={group}
            className="grid grid-cols-[2rem_1fr] items-center gap-x-2 py-2.5 first:pt-0 last:pb-0 sm:gap-x-3"
          >
            <span
              aria-hidden
              className="flex size-7 items-center justify-center rounded-md bg-zinc-100 text-xs font-bold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
            >
              {group}
            </span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-1.5">
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
      aria-label={team.name}
      title={team.name}
      className={`flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg border px-1.5 py-2 text-center transition-colors sm:min-h-9 sm:rounded-md sm:px-2 sm:py-1 ${
        active
          ? "border-emerald-600 bg-emerald-600 text-white"
          : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-500"
      }`}
    >
      <span aria-hidden className="shrink-0 text-base leading-none sm:text-sm">
        {getFlag(team.code)}
      </span>
      <span className="line-clamp-2 text-[11px] font-medium leading-tight sm:line-clamp-1 sm:text-xs">
        <span className="sm:hidden">{displayName(team.name, true)}</span>
        <span className="hidden sm:inline">{team.name}</span>
      </span>
    </button>
  );
}
