import { NextRequest, NextResponse } from "next/server";
import { ALL_MATCHES } from "@/lib/fixtures";
import { generateCalendarIcs } from "@/lib/ical";
import { ICS_FILENAME } from "@/lib/calendar-url";

export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get("ids");

  if (!idsParam) {
    return NextResponse.json(
      { error: "Missing ids query parameter" },
      { status: 400 },
    );
  }

  const requestedIds = idsParam.split(",").map((id) => id.trim()).filter(Boolean);
  const validIds = new Set(ALL_MATCHES.map((m) => m.id));
  const matchIds = requestedIds.filter((id) => validIds.has(id));

  if (matchIds.length === 0) {
    return NextResponse.json(
      { error: "No valid match ids provided" },
      { status: 400 },
    );
  }

  const tz = request.nextUrl.searchParams.get("tz") ?? "UTC";
  const ics = generateCalendarIcs(matchIds, tz);
  const download = request.nextUrl.searchParams.get("download") === "1";

  return new NextResponse(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": download
        ? `attachment; filename="${ICS_FILENAME}"`
        : `inline; filename="${ICS_FILENAME}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
