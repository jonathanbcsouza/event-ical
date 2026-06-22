"use client";

import { getFlag } from "@/lib/flags";
import {
  getStageColor,
  getStageLabel,
  type Match,
} from "@/lib/fixtures";

type MatchRowProps = {
  match: Match;
  checked: boolean;
  onToggle: () => void;
  showDate?: boolean;
  timeZone?: string;
};

export function MatchRow({
  match,
  checked,
  onToggle,
  showDate = true,
  timeZone,
}: MatchRowProps) {
  const date = new Date(match.startUtc);
  const stageColor = getStageColor(match.stage);

  return (
    <li>
      <label className="flex cursor-pointer gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900/60">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="mt-1 size-4 shrink-0 rounded border-zinc-300 accent-emerald-600"
        />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-50">
            <span aria-hidden className="text-base leading-none">
              {getFlag(match.home.code)}
            </span>
            <span className="truncate">{match.home.name}</span>
            <span className="text-zinc-400">vs</span>
            <span aria-hidden className="text-base leading-none">
              {getFlag(match.away.code)}
            </span>
            <span className="truncate">{match.away.name}</span>
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
            {showDate && (
              <span>
                {date.toLocaleString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  timeZone,
                })}
              </span>
            )}
            {!showDate && (
              <span>
                {date.toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "2-digit",
                  timeZone,
                })}
              </span>
            )}
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${stageColor.chip}`}
            >
              {getStageLabel(match.stage)}
            </span>
            <span className="text-zinc-400">Match {match.matchNumber}</span>
          </div>
          <p className="text-sm text-zinc-400">
            {match.venue}, {match.city}
          </p>
        </div>
      </label>
    </li>
  );
}
