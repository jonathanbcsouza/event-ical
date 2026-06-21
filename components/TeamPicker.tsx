"use client";

import { useEffect, useState } from "react";
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
  const [open, setOpen] = useState(selected.length === 0);

  useEffect(() => {
    if (selected.length === 0) setOpen(true);
  }, [selected.length]);

  return (
    <section className="rounded-xl border border-zinc-200 dark:border-zinc-800">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Select the teams you cheer for
        </span>
        {selected.length > 0 && (
          <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-medium text-white">
            {selected.length}
          </span>
        )}
        <span className="ml-auto flex items-center gap-2">
          {!open && selected.length > 0 && (
            <span aria-hidden className="text-sm leading-none">
              {selected.slice(0, 8).map((code) => getFlag(code)).join(" ")}
              {selected.length > 8 ? " …" : ""}
            </span>
          )}
          <svg
            className={`size-4 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>

      {open && (
        <div className="space-y-3 border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-500">
              Tap a country to filter its matches.
            </p>
            {selected.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-xs text-zinc-500 underline-offset-2 hover:text-zinc-800 hover:underline dark:hover:text-zinc-200"
              >
                Clear all
              </button>
            )}
          </div>
          {groups.map(({ group, teams }) => (
            <div key={group} className="flex flex-wrap items-center gap-1.5">
              <span className="w-6 shrink-0 text-[11px] font-semibold uppercase text-zinc-400">
                {group}
              </span>
              {teams.map((team) => (
                <TeamChip
                  key={team.code}
                  team={team}
                  active={selected.includes(team.code)}
                  onToggle={() => onChange(toggleTeam(selected, team.code))}
                />
              ))}
            </div>
          ))}
        </div>
      )}
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
      title={team.name}
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition-colors ${
        active
          ? "border-emerald-600 bg-emerald-600 text-white"
          : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-500"
      }`}
    >
      <span aria-hidden className="text-sm leading-none">
        {getFlag(team.code)}
      </span>
      {team.name}
    </button>
  );
}
