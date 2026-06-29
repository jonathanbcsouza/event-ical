"use client";

import { useTranslations } from "next-intl";
import { getAllTeams, getTeamsByGroup, type TeamRef } from "@/lib/fixtures";
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

export function teamSummary(selected: string[]): string {
  return selected.length === 0 ? "No teams selected" : selected.join(",");
}

export function useTeamSummary(selected: string[]): string {
  const t = useTranslations("steps");
  if (selected.length === 0) return t("noTeamsSelected");

  const groups = getTeamsByGroup();
  const names = groups
    .flatMap(({ teams }) => teams)
    .filter((team) => selected.includes(team.code))
    .map((team) => team.name);

  if (names.length <= 3) return names.join(", ");
  return `${names.slice(0, 3).join(", ")} ${t("teamMore", { count: names.length - 3 })}`;
}

export function TeamPickerControls({ selected, onChange }: TeamPickerProps) {
  const t = useTranslations("common");
  const allCodes = getAllTeams().map((team) => team.code);
  const allSelected = selected.length === allCodes.length;

  return (
    <>
      <button
        type="button"
        onClick={() => onChange(allSelected ? [] : allCodes)}
        className="shrink-0 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        {allSelected ? t("deselectAll") : t("selectAll")}
      </button>
      {selected.length > 0 && (
        <button
          type="button"
          onClick={() => onChange([])}
          className="shrink-0 py-1 text-xs text-zinc-500 underline-offset-2 hover:text-zinc-800 hover:underline dark:hover:text-zinc-200"
        >
          {t("clear")}
        </button>
      )}
    </>
  );
}

export function TeamPicker({ selected, onChange }: TeamPickerProps) {
  const tShort = useTranslations("teamPicker.shortNames");
  const groups = getTeamsByGroup();

  function displayName(team: TeamRef, compact: boolean): string {
    if (!compact) return team.name;
    const short = tShort(team.code as keyof typeof tShort);
    return short || team.name;
  }

  return (
    <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
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
                label={displayName(team, true)}
                fullLabel={team.name}
                active={selected.includes(team.code)}
                onToggle={() => onChange(toggleTeam(selected, team.code))}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TeamChip({
  team,
  label,
  fullLabel,
  active,
  onToggle,
}: {
  team: TeamRef;
  label: string;
  fullLabel: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      aria-label={fullLabel}
      title={fullLabel}
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
        <span className="sm:hidden">{label}</span>
        <span className="hidden sm:inline">{fullLabel}</span>
      </span>
    </button>
  );
}
