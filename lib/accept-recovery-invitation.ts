import { MembershipStatus } from "@prisma/client";

import { validateInvitationForAccept } from "@/lib/invitations/validate-invitation";
import { validateRecoveryInvitationForAccept } from "@/lib/invitations/validate-recovery-invitation";
import { prisma } from "@/lib/prisma";

export type AcceptRecoveryInvitationResult =
  | { ok: true; userId: string }
  | { ok: false; error: string };

/** Accept a recovery invitation — restores access to existing child only. */
export async function acceptRecoveryInvitationByToken(
  token: string,
): Promise<AcceptRecoveryInvitationResult> {
  const invitation = await prisma.invitation.findUnique({
    where: { token },
  });

  const invitationValidation = validateInvitationForAccept(invitation);
  if (!invitationValidation.ok) {
    return invitationValidation;
  }

  const recoveryValidation = await validateRecoveryInvitationForAccept(
    invitationValidation.invitation,
  );
  if (!recoveryValidation.ok) {
    return recoveryValidation;
  }

  const { childUserId } = recoveryValidation;

  try {
    const claimed = await prisma.$transaction(async (tx) => {
      const updated = await tx.invitation.updateMany({
        where: {
          id: recoveryValidation.invitation.id,
          userId: childUserId,
          acceptedAt: null,
          expiresAt: { gt: new Date() },
        },
        data: { acceptedAt: new Date() },
      });

      if (updated.count === 0) {
        throw new Error("INVITATION_ALREADY_USED");
      }

      const membership = await tx.familyMembership.findUnique({
        where: { userId: childUserId },
        select: { familyId: true, status: true },
      });

      if (
        !membership ||
        membership.familyId !== recoveryValidation.invitation.familyId ||
        membership.status !== MembershipStatus.ACTIVE
      ) {
        throw new Error("RECOVERY_MEMBERSHIP_INVALID");
      }

      return childUserId;
    });

    return { ok: true, userId: claimed };
  } catch (error) {
    if (error instanceof Error && error.message === "INVITATION_ALREADY_USED") {
      return { ok: false, error: "This invitation has already been used." };
    }

    return { ok: false, error: "Could not restore access. Please try again." };
  }
}
