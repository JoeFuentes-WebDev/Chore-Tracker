import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/tasks/[id]
 * Updates task status across the full lifecycle.
 * Body: { status: "PENDING" | "APPROVED" | "REJECTED", reward? }
 *   - PENDING:  set completedAt. Fire SMS via /api/notify (fire-and-forget,
 *               do NOT await on the main response path — see 7.1).
 *   - APPROVED: set approvedAt. Accept optional reward override.
 *   - REJECTED: set rejectedAt.
 * Response: Task
 */
export async function PATCH(_request: NextRequest, _context: RouteContext) {
  // TODO: validate status transition, update timestamps, and on PENDING
  //       trigger SMS notification without awaiting it.
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
