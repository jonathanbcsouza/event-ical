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

export type Match = {
  id: string;
  matchNumber: number;
  stage: MatchStage;
  home: TeamRef;
  away: TeamRef;
  startUtc: string;
  venue: string;
  city: string;
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
