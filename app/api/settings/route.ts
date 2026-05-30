import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * GET /api/settings
 * Returns the singleton Settings record (id = "singleton"). Creates it if it
 * does not exist.
 * Response: Settings
 */
export async function GET(_request: NextRequest) {
  // TODO: upsert/find the singleton Settings row and return it.
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}

/**
 * PATCH /api/settings
 * Updates the singleton Settings record.
 * Body: { parentPhone? }
 * Response: Settings
 */
export async function PATCH(_request: NextRequest) {
  // TODO: validate body, update the singleton Settings row, return it.
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
