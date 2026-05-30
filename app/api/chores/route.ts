import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * GET /api/chores
 * Returns all active chores (isActive = true).
 * Response: Chore[]
 */
export async function GET(_request: NextRequest) {
  // TODO: query active chores via prisma and return them.
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}

/**
 * POST /api/chores
 * Creates a new chore (parent-only action).
 * Body: { name, emoji, reward, recurring }
 * Response: Chore
 */
export async function POST(_request: NextRequest) {
  // TODO: validate body, create chore (createdBy = PARENT), return it.
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
