import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * GET /api/tasks
 * Returns all tasks. Optional query param: status (CLAIMED | PENDING | APPROVED | REJECTED).
 * Response: Task[]
 */
export async function GET(_request: NextRequest) {
  // TODO: parse optional `status` query param, filter, and return tasks.
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}

/**
 * POST /api/tasks
 * Creates a task (kid claims a chore). Snapshots name/emoji/reward from the
 * Chore at claim time.
 * Body: { choreId }
 * Response: Task
 *
 * Rule (7.2): return 409 if a CLAIMED or PENDING task already exists for the
 * given choreId.
 */
export async function POST(_request: NextRequest) {
  // TODO: validate choreId, enforce no duplicate active task (409),
  //       snapshot chore fields, create task in CLAIMED status.
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
