"use client";

import { useLocale, useTranslations } from "next-intl";
import { getFlag } from "@/lib/flags";
import {
  formatMatchScore,
  getStageColor,
  isMatchSelectable,
  type Match,
  type MatchStage,
} from "@/lib/fixtures";

type MatchRowProps = {
  match: Match;
  checked: boolean;
  onToggle: () => void;
  showDate?: boolean;
  timeZone?: string;
  now?: number;
};

export function MatchRow({
  match,
  checked,
  onToggle,
  showDate = true,
  timeZone,
  now,
}: MatchRowProps) {
  const locale = useLocale();
  const tCommon = useTranslations("common");
  const tStages = useTranslations("stages");

  const date = new Date(match.startUtc);
  const stageColor = getStageColor(match.stage);
  const selectable = isMatchSelectable(match, now);
  const score = formatMatchScore(match);
  const homeWon = match.result?.winner === "home";
  const awayWon = match.result?.winner === "away";
  const stageLabel = tStages(match.stage as MatchStage);

  const content = (
    <div className="min-w-0 flex-1">
      {score ? (
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-base font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
          <span
            className={`inline-flex items-center gap-1.5 ${homeWon ? "text-emerald-700 dark:text-emerald-400" : ""}`}
          >
            <span aria-hidden className="text-base leading-none">
              {getFlag(match.home.code)}
            </span>
            <span>{match.result!.homeScore}</span>
            <span className="truncate font-medium">{match.home.name}</span>
          </span>
          <span className="text-zinc-400">–</span>
          <span
            className={`inline-flex items-center gap-1.5 ${awayWon ? "text-emerald-700 dark:text-emerald-400" : ""}`}
          >
            <span>{match.result!.awayScore}</span>
            <span className="truncate font-medium">{match.away.name}</span>
            <span aria-hidden className="text-base leading-none">
              {getFlag(match.away.code)}
            </span>
          </span>
        </p>
      ) : (
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-medium text-zinc-900 dark:text-zinc-50">
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="text-base leading-none">
              {getFlag(match.home.code)}
            </span>
            <span className="truncate">{match.home.name}</span>
          </span>
          <span className="text-zinc-400">{tCommon("vs")}</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="truncate">{match.away.name}</span>
            <span aria-hidden className="text-base leading-none">
              {getFlag(match.away.code)}
            </span>
          </span>
        </p>
      )}
      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
        {showDate && (
          <span>
            {date.toLocaleString(locale, {
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
            {date.toLocaleTimeString(locale, {
              hour: "numeric",
              minute: "2-digit",
              timeZone,
            })}
          </span>
        )}
        {score && (
          <span className="rounded-full bg-zinc-200/80 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            {tCommon("final")}
          </span>
        )}
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${stageColor.chip}`}
        >
          {stageLabel}
        </span>
        <span className="text-zinc-400">
          {tCommon("match")} {match.matchNumber}
        </span>
      </div>
      <p className="text-sm text-zinc-400">
        {match.venue}, {match.city}
      </p>
    </div>
  );

  if (!selectable) {
    return (
      <li className="bg-zinc-50/80 px-4 py-3 dark:bg-zinc-900/40">
        {content}
      </li>
    );
  }

  return (
    <li>
      <label className="flex cursor-pointer gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900/60">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="mt-1 size-4 shrink-0 rounded border-zinc-300 accent-emerald-600"
        />
        {content}
      </label>
    </li>
  );
}
