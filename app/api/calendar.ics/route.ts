import { NextRequest, NextResponse } from "next/server";
import { parseStageList, filterUpcomingMatches, type Match } from "@/lib/fixtures";
import { generateCalendarIcs } from "@/lib/ical";
import { ICS_FILENAME } from "@/lib/calendar-url";
import {
  filterMatchesByStages,
  filterMatchesByTeamCodes,
  getResolvedMatches,
  unionMatches,
} from "@/lib/resolve";

function parseCsv(param: string | null): string[] {
  if (!param) return [];
  return param
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

async function resolveCalendarMatches(request: NextRequest): Promise<Match[]> {
  const idsParam = request.nextUrl.searchParams.get("ids");
  const teamsParam = request.nextUrl.searchParams.get("teams");
  const stagesParam = request.nextUrl.searchParams.get("stages");
  const allParam = request.nextUrl.searchParams.get("all");

  const resolved = await getResolvedMatches();

  if (allParam === "1") {
    return filterUpcomingMatches(resolved);
  }

  if (idsParam) {
    const requestedIds = parseCsv(idsParam);
    const validIds = new Set(resolved.map((m) => m.id));
    const matchIds = requestedIds.filter((id) => validIds.has(id));
    return filterUpcomingMatches(
      resolved.filter((m) => matchIds.includes(m.id)),
    );
  }

  const teamCodes = parseCsv(teamsParam);
  const stages = parseStageList(stagesParam);

  const lists: Match[][] = [];
  if (teamCodes.length > 0) {
    lists.push(filterMatchesByTeamCodes(resolved, teamCodes));
  }
  if (stages.length > 0) {
    lists.push(filterMatchesByStages(resolved, stages));
  }

  if (lists.length === 0) return [];
  return filterUpcomingMatches(unionMatches(...lists));
}

export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get("ids");
  const teamsParam = request.nextUrl.searchParams.get("teams");
  const stagesParam = request.nextUrl.searchParams.get("stages");
  const allParam = request.nextUrl.searchParams.get("all");

  if (!idsParam && !teamsParam && !stagesParam && allParam !== "1") {
    return NextResponse.json(
      { error: "Provide ids, teams, or stages query parameters" },
      { status: 400 },
    );
  }

  const matches = await resolveCalendarMatches(request);

  if (matches.length === 0) {
    return NextResponse.json(
      { error: "No matching fixtures found" },
      { status: 400 },
    );
  }

  const tz = request.nextUrl.searchParams.get("tz") ?? "UTC";
  const ics = generateCalendarIcs(matches, tz);
  const download = request.nextUrl.searchParams.get("download") === "1";

  return new NextResponse(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": download
        ? `attachment; filename="${ICS_FILENAME}"`
        : `inline; filename="${ICS_FILENAME}"`,
      "Cache-Control": "public, max-age=1800, s-maxage=1800",
    },
  });
}
