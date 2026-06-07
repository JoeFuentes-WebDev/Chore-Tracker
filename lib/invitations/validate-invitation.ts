import type { Invitation } from "@prisma/client";

export type InvitationValidationResult =
  | { ok: true; invitation: Invitation }
  | { ok: false; error: string };

/** Validate invitation is present, unused, and not expired. */
export function validateInvitationForAccept(
  invitation: Invitation | null,
): InvitationValidationResult {
  if (!invitation) {
    return { ok: false, error: "This invitation is invalid." };
  }

  if (invitation.acceptedAt) {
    return { ok: false, error: "This invitation has already been used." };
  }

  if (invitation.expiresAt.getTime() <= Date.now()) {
    return { ok: false, error: "This invitation has expired." };
  }

  return { ok: true, invitation };
}
