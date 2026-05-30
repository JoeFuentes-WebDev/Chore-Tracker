// Twilio SMS helper.
//
// Used by POST /api/notify to send chore-completion notifications.
// Rules (see requirements 7.1):
//   - Never throw. On failure, callers log NotificationStatus.FAILED.
//   - Fire-and-forget from the task status path; SMS failure never blocks a
//     task status change.
//   - If parentPhone is not set, skip silently (handled by the caller).

export interface SendSmsParams {
  to: string; // E.164 destination, e.g. +14155551234
  body: string;
}

export interface SendSmsResult {
  success: boolean;
  sid?: string;
  error?: string;
}

// TODO: lazily construct the Twilio client from env:
//   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER
// export function getTwilioClient() { ... }

/**
 * Send an SMS via Twilio. Resolves with a result object; never rejects.
 */
export async function sendSms(_params: SendSmsParams): Promise<SendSmsResult> {
  // TODO: implement Twilio send + map success/failure into SendSmsResult.
  throw new Error("Not implemented");
}
