import { NextResponse } from "next/server";

import {
  DEMO_SESSION_COOKIE,
  getDemoSessionCookieOptions,
} from "@/lib/demo/demo-session";
import { prepareDemoSession } from "@/lib/demo/prepare-demo-session";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST() {
  const result = await prepareDemoSession();

  if (!result.ok) {
    return NextResponse.json(
      { ok: false as const, error: result.error },
      { status: result.status },
    );
  }

  const response = NextResponse.json({ ok: true as const });

  response.cookies.set(
    DEMO_SESSION_COOKIE,
    result.familyId,
    getDemoSessionCookieOptions(),
  );

  return response;
}
