import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * POST /api/notify
 * Sends an SMS via Twilio. Called internally by PATCH /api/tasks/[id].
 * Body: { taskId, phone, message }
 * Logs the result to NotificationLog.
 *
 * Never throws. On Twilio failure: log NotificationStatus.FAILED and return
 * 200 with { success: false }.
 * Response: { success: boolean, sid?: string, error?: string }
 */
export async function POST(_request: NextRequest) {
  // TODO: send via lib/twilio.sendSms, write NotificationLog (SENT/FAILED),
  //       always return 200 with a NotifyResult payload.
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
