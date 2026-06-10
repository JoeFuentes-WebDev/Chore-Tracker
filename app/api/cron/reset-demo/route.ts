import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";

export const maxDuration = 60;

function isAuthorizedCronRequest(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return false;
  }

  const authorization = request.headers.get("authorization");
  return authorization === `Bearer ${cronSecret}`;
}

/** Nightly wipe of all demo families and cascaded data. */
export async function GET(request: NextRequest) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await prisma.family.deleteMany({
    where: { isDemo: true },
  });

  return NextResponse.json({
    ok: true,
    deletedFamilies: result.count,
  });
}
