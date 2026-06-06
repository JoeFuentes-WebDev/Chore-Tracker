import type { Invitation } from "@prisma/client";

/** True when invitation restores an existing child rather than onboarding a new one. */
export function isRecoveryInvitation(
  invitation: Pick<Invitation, "userId">,
): boolean {
  return invitation.userId !== null;
}
