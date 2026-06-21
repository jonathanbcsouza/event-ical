import { NextRequest, NextResponse } from "next/server";
import { ALL_MATCHES } from "@/lib/fixtures";
import { generateCalendarIcs } from "@/lib/ical";

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

  const ics = generateCalendarIcs(matchIds);

  return new NextResponse(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="world-cup-2026.ics"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
