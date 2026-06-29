import {
  ALL_MATCHES,
  GROUPS,
  type Match,
  type MatchResult,
  type MatchStage,
  type TeamRef,
} from "@/lib/fixtures";
import { loadResultRows, type ResultRow } from "@/lib/results-source";

function pairKey(a: string, b: string): string {
  return [a, b].sort().join("-");
}

function buildResultsByPair(rows: ResultRow[]): Map<string, ResultRow[]> {
  const map = new Map<string, ResultRow[]>();
  for (const row of rows) {
    const list = map.get(row.pair);
    if (list) list.push(row);
    else map.set(row.pair, [row]);
  }
  return map;
}

function pickResult(rows: ResultRow[], startUtc: string): ResultRow {
  if (rows.length === 1) return rows[0];
  const target = new Date(startUtc).getTime();
  return rows.reduce((best, row) => {
    const bestDiff = Math.abs(new Date(best.date).getTime() - target);
    const rowDiff = Math.abs(new Date(row.date).getTime() - target);
    return rowDiff < bestDiff ? row : best;
  });
}

function overlayResult(
  match: Match,
  resultsByPair: Map<string, ResultRow[]>,
): Match {
  if (match.home.code === "TBD" || match.away.code === "TBD") return match;

  const rows = resultsByPair.get(pairKey(match.home.code, match.away.code));
  if (!rows || rows.length === 0) return match;

  const row = pickResult(rows, match.startUtc);
  const homeScore = row.scores[match.home.code];
  const awayScore = row.scores[match.away.code];
  if (homeScore == null || awayScore == null) return match;

  const winner: MatchResult["winner"] =
    row.winner === "draw"
      ? "draw"
      : row.winner === match.home.code
        ? "home"
        : "away";

  return {
    ...match,
    result: { homeScore, awayScore, winner },
    status: "finished",
  };
}

const TEAM_GROUP = new Map<string, string>();
const TEAM_NAME = new Map<string, string>();
for (const [group, codes] of Object.entries(GROUPS)) {
  for (const code of codes) TEAM_GROUP.set(code, group);
}
for (const match of ALL_MATCHES) {
  if (match.home.code !== "TBD") TEAM_NAME.set(match.home.code, match.home.name);
  if (match.away.code !== "TBD") TEAM_NAME.set(match.away.code, match.away.name);
}

type Standing = { code: string; pts: number; gd: number; gf: number };

const compareStandings = (a: Standing, b: Standing): number =>
  b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.code.localeCompare(b.code);

function teamRef(code: string): TeamRef {
  return { code, name: TEAM_NAME.get(code) ?? code };
}

function computeGroupStandings(matches: Match[]): Record<string, Standing[]> {
  const stats = new Map<string, Standing>();
  for (const code of TEAM_GROUP.keys()) {
    stats.set(code, { code, pts: 0, gd: 0, gf: 0 });
  }
  for (const m of matches) {
    if (m.stage !== "group" || !m.result) continue;
    const home = stats.get(m.home.code);
    const away = stats.get(m.away.code);
    if (!home || !away) continue;
    const { homeScore, awayScore } = m.result;
    home.gf += homeScore;
    home.gd += homeScore - awayScore;
    away.gf += awayScore;
    away.gd += awayScore - homeScore;
    if (homeScore > awayScore) home.pts += 3;
    else if (awayScore > homeScore) away.pts += 3;
    else {
      home.pts += 1;
      away.pts += 1;
    }
  }
  const standings: Record<string, Standing[]> = {};
  for (const [group, codes] of Object.entries(GROUPS)) {
    standings[group] = codes
      .map((code) => stats.get(code)!)
      .sort(compareStandings);
  }
  return standings;
}

// Assign the best third-placed teams to their R32 slots, honouring the
// group-letter set permitted for each slot (deterministic bipartite matching).
function assignBestThirds(
  matches: Match[],
  standings: Record<string, Standing[]>,
): Map<string, string> {
  const thirds = Object.entries(standings)
    .map(([group, arr]) => ({ group, ...arr[2] }))
    .sort(compareStandings)
    .slice(0, 8);
  const qualifiedByGroup = new Map(thirds.map((t) => [t.group, t.code]));

  type Slot = { matchId: string; side: "home" | "away"; allowed: string[] };
  const slots: Slot[] = [];
  for (const m of matches) {
    if (m.stage !== "r32") continue;
    for (const side of ["home", "away"] as const) {
      const found = m[side].name.match(/3rd Place \(([A-L/]+)\)/);
      if (found) slots.push({ matchId: m.id, side, allowed: found[1].split("/") });
    }
  }

  const slotToGroup = new Map<number, string>();
  const groupToSlot = new Map<string, number>();
  const tryAssign = (si: number, seen: Set<string>): boolean => {
    for (const group of slots[si].allowed) {
      if (!qualifiedByGroup.has(group) || seen.has(group)) continue;
      seen.add(group);
      const occupied = groupToSlot.get(group);
      if (occupied === undefined || tryAssign(occupied, seen)) {
        groupToSlot.set(group, si);
        slotToGroup.set(si, group);
        return true;
      }
    }
    return false;
  };
  slots.forEach((_, i) => tryAssign(i, new Set()));

  const assignment = new Map<string, string>();
  slots.forEach((slot, i) => {
    const group = slotToGroup.get(i);
    if (group) assignment.set(`${slot.matchId}:${slot.side}`, qualifiedByGroup.get(group)!);
  });
  return assignment;
}

function winnerCode(match: Match): string | undefined {
  if (!match.result || match.home.code === "TBD" || match.away.code === "TBD") {
    return undefined;
  }
  if (match.result.winner === "home") return match.home.code;
  if (match.result.winner === "away") return match.away.code;
  return undefined;
}

// Fill TBD knockout slots from group standings and earlier-round winners.
function resolveKnockoutTeams(matches: Match[]): Match[] {
  const standings = computeGroupStandings(matches);
  const thirdAssignment = assignBestThirds(matches, standings);
  const byNumber = new Map(matches.map((m) => [m.matchNumber, m]));

  const resolveFeeder = (
    match: Match,
    side: "home" | "away",
  ): string | undefined => {
    const name = match[side].name;
    let found: RegExpMatchArray | null;
    if ((found = name.match(/^Group ([A-L]) Winner$/))) {
      return standings[found[1]]?.[0]?.code;
    }
    if ((found = name.match(/^Group ([A-L]) Runner-up$/))) {
      return standings[found[1]]?.[1]?.code;
    }
    if (name.match(/3rd Place/)) {
      return thirdAssignment.get(`${match.id}:${side}`);
    }
    if ((found = name.match(/^Winner Match (\d+)$/))) {
      const source = byNumber.get(Number(found[1]));
      return source ? winnerCode(source) : undefined;
    }
    return undefined;
  };

  // Iterate to a fixpoint so later rounds resolve once earlier ones are known.
  let changed = true;
  while (changed) {
    changed = false;
    for (const match of matches) {
      if (match.stage === "group") continue;
      for (const side of ["home", "away"] as const) {
        if (match[side].code !== "TBD") continue;
        const code = resolveFeeder(match, side);
        if (code && code !== "TBD") {
          match[side] = teamRef(code);
          changed = true;
        }
      }
    }
  }
  return matches;
}

export function resolveMatches(
  staticMatches: Match[],
  rows: ResultRow[],
): Match[] {
  const resultsByPair = buildResultsByPair(rows);
  // Clone so in-place knockout resolution never mutates shared fixture data.
  let matches = staticMatches.map((m) => ({
    ...overlayResult(m, resultsByPair),
  }));
  matches = resolveKnockoutTeams(matches);
  // Overlay again so any results for freshly-resolved knockout pairs apply.
  return matches.map((m) => overlayResult(m, resultsByPair));
}

export async function getResolvedMatches(): Promise<Match[]> {
  const rows = await loadResultRows();
  return resolveMatches(ALL_MATCHES, rows);
}

export function filterMatchesByStages(
  matches: Match[],
  stages: MatchStage[],
): Match[] {
  if (stages.length === 0) return [];
  const stageSet = new Set(stages);
  return matches.filter((m) => stageSet.has(m.stage));
}

export function filterMatchesByTeamCodes(
  matches: Match[],
  teamCodes: string[],
): Match[] {
  if (teamCodes.length === 0) return [];
  const codeSet = new Set(teamCodes);
  return matches.filter(
    (m) =>
      (m.home.code !== "TBD" && codeSet.has(m.home.code)) ||
      (m.away.code !== "TBD" && codeSet.has(m.away.code)),
  );
}

export function unionMatches(...lists: Match[][]): Match[] {
  const seen = new Set<string>();
  const out: Match[] = [];
  for (const list of lists) {
    for (const m of list) {
      if (!seen.has(m.id)) {
        seen.add(m.id);
        out.push(m);
      }
    }
  }
  return out.sort(
    (a, b) => new Date(a.startUtc).getTime() - new Date(b.startUtc).getTime(),
  );
}
