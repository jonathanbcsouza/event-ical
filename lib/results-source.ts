import fallbackResults from "@/data/results-2026.json";
import teamsData from "@/data/teams.json";

export type ResultRow = {
  pair: string;
  date: string;
  scores: Record<string, number>;
  winner: string;
};

const DEFAULT_SOURCE_URL =
  "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";

const aliasMap = new Map(
  Object.entries(teamsData.aliases).map(([name, code]) => [
    normalizeName(name),
    code,
  ]),
);

function normalizeName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s*&\s*/g, " and ");
}

function toCode(name: string): string | undefined {
  return aliasMap.get(normalizeName(name));
}

function pairKey(a: string, b: string): string {
  return [a, b].sort().join("-");
}

type OpenFootballMatch = {
  date?: string;
  team1?: string;
  team2?: string;
  score?: { ft?: number[] };
};

export function parseOpenFootballResults(
  matches: OpenFootballMatch[],
): ResultRow[] {
  const rows: ResultRow[] = [];

  for (const match of matches) {
    const ft = match.score?.ft;
    if (!Array.isArray(ft) || ft.length !== 2) continue;
    if (typeof ft[0] !== "number" || typeof ft[1] !== "number") continue;

    const homeCode = toCode(match.team1 ?? "");
    const awayCode = toCode(match.team2 ?? "");
    if (!homeCode || !awayCode) continue;

    const scores = { [homeCode]: ft[0], [awayCode]: ft[1] };
    let winner = "draw";
    if (ft[0] > ft[1]) winner = homeCode;
    else if (ft[1] > ft[0]) winner = awayCode;

    rows.push({
      pair: pairKey(homeCode, awayCode),
      date: match.date ?? "",
      scores,
      winner,
    });
  }

  rows.sort((a, b) => a.date.localeCompare(b.date));
  return rows;
}

export async function fetchLiveResultRows(): Promise<ResultRow[]> {
  const sourceUrl =
    process.env.RESULTS_SOURCE_URL?.trim() || DEFAULT_SOURCE_URL;

  const res = await fetch(sourceUrl, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Results source returned ${res.status}`);
  }

  const data = (await res.json()) as { matches?: OpenFootballMatch[] };
  const matches = Array.isArray(data?.matches) ? data.matches : [];
  return parseOpenFootballResults(matches);
}

/** Latest scores from openfootball; bundled JSON if the fetch fails. */
export async function loadResultRows(): Promise<ResultRow[]> {
  try {
    return await fetchLiveResultRows();
  } catch {
    return fallbackResults as unknown as ResultRow[];
  }
}
