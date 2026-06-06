import { UserRole, type Invitation } from "@prisma/client";

import { isRecoveryInvitation } from "@/lib/invitations/is-recovery-invitation";
import { prisma } from "@/lib/prisma";

export type RecoveryInvitationValidationResult =
  | { ok: true; invitation: Invitation; childUserId: string; childName: string }
  | { ok: false; error: string };

/** Validate a recovery invitation and resolve the linked child. */
export async function validateRecoveryInvitationForAccept(
  invitation: Invitation,
): Promise<RecoveryInvitationValidationResult> {
  if (!isRecoveryInvitation(invitation)) {
    return { ok: false, error: "This invitation is invalid." };
  }

  const childUserId = invitation.userId;
  if (!childUserId) {
    return { ok: false, error: "This invitation is invalid." };
  }

  const membership = await prisma.familyMembership.findUnique({
    where: { userId: childUserId },
    include: { user: { select: { id: true, name: true, role: true } } },
  });

  if (!membership || membership.familyId !== invitation.familyId) {
    return { ok: false, error: "This invitation is invalid." };
  }

  if (membership.user.role !== UserRole.CHILD) {
    return { ok: false, error: "This invitation is invalid." };
  }

  return {
    ok: true,
    invitation,
    childUserId: membership.user.id,
    childName: membership.user.name,
  };
}
