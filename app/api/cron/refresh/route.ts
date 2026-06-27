import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getLiveSchedule } from "@/lib/live-schedule";

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidateTag("live-schedule", "max");
  await getLiveSchedule();

  return NextResponse.json({ ok: true, revalidated: true });
}
