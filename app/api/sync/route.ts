import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { syncChannel } from "@/lib/youtube";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function bearerOk(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const given = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const a = Buffer.from(given);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Scheduled sync. Vercel Cron sends `Authorization: Bearer $CRON_SECRET`. */
export async function GET(req: Request) {
  if (!bearerOk(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const result = await syncChannel();
  revalidatePath("/", "layout");
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}

/** Manual sync from the admin UI (session cookie) or an external trigger (bearer). */
export async function POST(req: Request) {
  if (!bearerOk(req) && !(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await syncChannel();
  revalidatePath("/", "layout");
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
