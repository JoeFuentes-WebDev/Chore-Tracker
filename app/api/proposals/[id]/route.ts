import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/proposals/[id]
 * Parent approves or rejects a proposal.
 * Body: { status: "APPROVED" | "REJECTED", approvedReward? }
 *   - APPROVED: create a Chore (recurring: false) and a Task in CLAIMED status.
 *   - REJECTED: soft-delete the proposal (status REJECTED).
 * Response: Proposal
 */
export async function PATCH(_request: NextRequest, _context: RouteContext) {
  // TODO: on APPROVED, create Chore + Task (CLAIMED) in a transaction;
  //       on REJECTED, mark proposal rejected. Return the updated proposal.
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
