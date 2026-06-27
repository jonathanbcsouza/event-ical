import {
  ALL_MATCHES,
  type Match,
  type MatchResult,
  type MatchStage,
  type TeamRef,
} from "@/lib/fixtures";
import {
  feedDateToUtcIso,
  getLiveSchedule,
  type FeedRow,
} from "@/lib/live-schedule";
import { resolveTeam } from "@/lib/teams";

function overlayTeam(staticTeam: TeamRef, feedName: string): TeamRef {
  const resolved = resolveTeam(feedName);
  if (resolved.code !== "TBD") return resolved;
  return staticTeam;
}

function parseResult(
  feed: FeedRow,
  home: TeamRef,
  away: TeamRef,
): MatchResult | undefined {
  if (
    feed.homeTeamScore === null ||
    feed.awayTeamScore === null ||
    !feed.winner ||
    feed.winner === "Draw"
  ) {
    if (
      feed.homeTeamScore !== null &&
      feed.awayTeamScore !== null &&
      feed.winner === "Draw"
    ) {
      return {
        homeScore: feed.homeTeamScore,
        awayScore: feed.awayTeamScore,
        winner: "draw",
      };
    }
    return undefined;
  }

  let winner: MatchResult["winner"] = "draw";
  const homeResolved = resolveTeam(feed.homeTeam);
  const awayResolved = resolveTeam(feed.awayTeam);
  const winnerResolved = resolveTeam(feed.winner);

  if (winnerResolved.code !== "TBD") {
    if (winnerResolved.code === homeResolved.code) winner = "home";
    else if (winnerResolved.code === awayResolved.code) winner = "away";
    else if (feed.winner === home.name || feed.winner === feed.homeTeam)
      winner = "home";
    else if (feed.winner === away.name || feed.winner === feed.awayTeam)
      winner = "away";
  } else if (feed.winner === feed.homeTeam) {
    winner = "home";
  } else if (feed.winner === feed.awayTeam) {
    winner = "away";
  }

  return {
    homeScore: feed.homeTeamScore,
    awayScore: feed.awayTeamScore,
    winner,
  };
}

export function resolveMatches(
  staticMatches: Match[],
  feedMap: Map<number, FeedRow> | null,
): Match[] {
  if (!feedMap) return staticMatches;

  return staticMatches.map((match) => {
    const feed = feedMap.get(match.matchNumber);
    if (!feed) return match;

    const home = overlayTeam(match.home, feed.homeTeam);
    const away = overlayTeam(match.away, feed.awayTeam);
    const result = parseResult(feed, home, away);
    const startUtc = feed.dateUtc
      ? feedDateToUtcIso(feed.dateUtc)
      : match.startUtc;

    return {
      ...match,
      home,
      away,
      startUtc,
      ...(result ? { result, status: "finished" as const } : {}),
    };
  });
}

export async function getResolvedMatches(): Promise<Match[]> {
  const feedMap = await getLiveSchedule();
  return resolveMatches(ALL_MATCHES, feedMap);
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
