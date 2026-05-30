import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * GET /api/proposals
 * Returns proposals (parent review list fetches status = PENDING).
 * Response: Proposal[]
 */
export async function GET(_request: NextRequest) {
  // TODO: query proposals (optionally filter by status) and return them.
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}

/**
 * POST /api/proposals
 * Kid submits a proposed chore with a suggested reward.
 * Body: { name, emoji, suggestedReward }
 * Response: Proposal
 */
export async function POST(_request: NextRequest) {
  // TODO: validate body, create proposal in PENDING status, return it.
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
