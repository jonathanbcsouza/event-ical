import resultsData from "@/data/results-2026.json";
import {
  ALL_MATCHES,
  type Match,
  type MatchResult,
  type MatchStage,
} from "@/lib/fixtures";

type ResultRow = {
  pair: string;
  date: string;
  scores: Record<string, number>;
  winner: string;
};

const ROWS = resultsData as unknown as ResultRow[];

function pairKey(a: string, b: string): string {
  return [a, b].sort().join("-");
}

const RESULTS_BY_PAIR = new Map<string, ResultRow[]>();
for (const row of ROWS) {
  const list = RESULTS_BY_PAIR.get(row.pair);
  if (list) list.push(row);
  else RESULTS_BY_PAIR.set(row.pair, [row]);
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

function overlayResult(match: Match): Match {
  if (match.home.code === "TBD" || match.away.code === "TBD") return match;

  const rows = RESULTS_BY_PAIR.get(pairKey(match.home.code, match.away.code));
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

export function resolveMatches(staticMatches: Match[]): Match[] {
  return staticMatches.map(overlayResult);
}

export function getResolvedMatches(): Match[] {
  return resolveMatches(ALL_MATCHES);
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
