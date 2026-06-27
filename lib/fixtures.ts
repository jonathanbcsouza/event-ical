import fixtureData from "@/data/fixtures-2026.json";

export type MatchStage =
  | "group"
  | "r32"
  | "r16"
  | "qf"
  | "sf"
  | "third"
  | "final";

export type TeamRef = {
  code: string;
  name: string;
};

export type MatchResult = {
  homeScore: number;
  awayScore: number;
  winner: "home" | "away" | "draw";
};

export type Match = {
  id: string;
  matchNumber: number;
  stage: MatchStage;
  home: TeamRef;
  away: TeamRef;
  startUtc: string;
  venue: string;
  city: string;
  result?: MatchResult;
  status?: "scheduled" | "finished";
};

export type GroupId = keyof typeof fixtureData.groups;

const STAGE_LABELS: Record<MatchStage, string> = {
  group: "Group stage",
  r32: "Round of 32",
  r16: "Round of 16",
  qf: "Quarter-final",
  sf: "Semi-final",
  third: "Third place",
  final: "Final",
};

export const TOURNAMENT = fixtureData.tournament;
export const GROUPS = fixtureData.groups as Record<GroupId, string[]>;
export const ALL_MATCHES = fixtureData.matches as Match[];

export function getStageLabel(stage: MatchStage): string {
  return STAGE_LABELS[stage];
}

export type StageColor = {
  dot: string;
  chip: string;
};

const STAGE_COLORS: Record<MatchStage, StageColor> = {
  group: {
    dot: "bg-sky-500",
    chip: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  },
  r32: {
    dot: "bg-teal-500",
    chip: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
  },
  r16: {
    dot: "bg-emerald-500",
    chip: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  qf: {
    dot: "bg-amber-500",
    chip: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  sf: {
    dot: "bg-orange-500",
    chip: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  },
  third: {
    dot: "bg-rose-400",
    chip: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  },
  final: {
    dot: "bg-rose-600",
    chip: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  },
};

export function getStageColor(stage: MatchStage): StageColor {
  return STAGE_COLORS[stage];
}

export function getAllTeams(): TeamRef[] {
  const seen = new Map<string, TeamRef>();
  for (const codes of Object.values(GROUPS)) {
    for (const code of codes) {
      if (!seen.has(code)) {
        const match = ALL_MATCHES.find(
          (m) => m.home.code === code || m.away.code === code,
        );
        const name =
          match?.home.code === code
            ? match.home.name
            : match?.away.code === code
              ? match.away.name
              : code;
        seen.set(code, { code, name });
      }
    }
  }
  return Array.from(seen.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

export function getTeamsByGroup(): { group: GroupId; teams: TeamRef[] }[] {
  const allTeams = getAllTeams();
  const byCode = new Map(allTeams.map((t) => [t.code, t]));
  return (Object.keys(GROUPS) as GroupId[]).map((group) => ({
    group,
    teams: GROUPS[group].map((code) => byCode.get(code)!),
  }));
}

export function matchInvolvesTeam(match: Match, teamCode: string): boolean {
  if (teamCode === "TBD") return false;
  return match.home.code === teamCode || match.away.code === teamCode;
}

export function filterMatchesByTeams(
  matches: Match[],
  teamCodes: string[],
): Match[] {
  if (teamCodes.length === 0) return [];
  return matches.filter((m) =>
    teamCodes.some((code) => matchInvolvesTeam(m, code)),
  );
}

export function getMatchById(id: string): Match | undefined {
  return ALL_MATCHES.find((m) => m.id === id);
}

export function getMatchesByIds(ids: string[]): Match[] {
  const idSet = new Set(ids);
  return ALL_MATCHES.filter((m) => idSet.has(m.id));
}

export function formatMatchTitle(match: Match): string {
  return `${match.home.name} vs ${match.away.name}`;
}

export function formatMatchScore(match: Match): string | undefined {
  if (!match.result) return undefined;
  const { homeScore, awayScore } = match.result;
  return `${homeScore}–${awayScore}`;
}

const MATCH_DURATION_MS = 2 * 60 * 60 * 1000;

export function isMatchFinished(match: Match): boolean {
  return match.status === "finished" || !!match.result;
}

export function isMatchUpcoming(match: Match, now = Date.now()): boolean {
  if (isMatchFinished(match)) return false;
  return new Date(match.startUtc).getTime() + MATCH_DURATION_MS > now;
}

export function isMatchSelectable(match: Match, now = Date.now()): boolean {
  return isMatchUpcoming(match, now);
}

export function partitionMatches(
  matches: Match[],
  now = Date.now(),
): {
  upcoming: Match[];
  results: Match[];
} {
  const upcoming: Match[] = [];
  const results: Match[] = [];
  for (const match of matches) {
    if (isMatchFinished(match) || !isMatchUpcoming(match, now)) {
      results.push(match);
    } else {
      upcoming.push(match);
    }
  }
  return { upcoming, results };
}

export function filterUpcomingMatches(matches: Match[], now = Date.now()): Match[] {
  return matches.filter((m) => isMatchUpcoming(m, now));
}

export const KNOCKOUT_STAGES: MatchStage[] = [
  "r32",
  "r16",
  "qf",
  "sf",
  "third",
  "final",
];

export function isKnockoutStage(stage: MatchStage): boolean {
  return KNOCKOUT_STAGES.includes(stage);
}

export function parseStageList(param: string | null): MatchStage[] {
  if (!param) return [];
  const valid = new Set<MatchStage>([
    "group",
    ...KNOCKOUT_STAGES,
  ]);
  return param
    .split(",")
    .map((s) => s.trim())
    .filter((s): s is MatchStage => valid.has(s as MatchStage));
}

export function countByStage(matches: Match[]): Record<MatchStage, number> {
  const counts: Record<MatchStage, number> = {
    group: 0,
    r32: 0,
    r16: 0,
    qf: 0,
    sf: 0,
    third: 0,
    final: 0,
  };
  for (const m of matches) {
    counts[m.stage]++;
  }
  return counts;
}
