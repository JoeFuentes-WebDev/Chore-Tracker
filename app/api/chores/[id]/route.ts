import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/chores/[id]
 * Partial update of a chore. isActive: false performs a soft delete.
 * Body: Partial<{ name, emoji, reward, recurring, isActive }>
 * Response: Chore
 */
export async function PATCH(_request: NextRequest, _context: RouteContext) {
  // TODO: validate partial body, update chore by id, return it.
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
