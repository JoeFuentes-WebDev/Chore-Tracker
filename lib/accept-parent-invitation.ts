import { UserRole } from "@prisma/client";

import { getClerkParentUser } from "@/lib/auth/get-clerk-parent-user";
import { isParentInvitation } from "@/lib/invitations/is-parent-invitation";
import { validateInvitationForAccept } from "@/lib/invitations/validate-invitation";
import { prisma } from "@/lib/prisma";

export type AcceptParentInvitationResult =
  | { ok: true; familyId: string }
  | { ok: false; error: string };

/** Accept a parent invitation — links signed-in Clerk parent to the family. */
export async function acceptParentInvitationByToken(
  token: string,
): Promise<AcceptParentInvitationResult> {
  const parentUser = await getClerkParentUser();

  if (!parentUser) {
    return { ok: false, error: "Sign in to join this family." };
  }

  const invitation = await prisma.invitation.findUnique({
    where: { token },
  });

  const invitationValidation = validateInvitationForAccept(invitation);
  if (!invitationValidation.ok) {
    return invitationValidation;
  }

  const { invitation: validInvitation } = invitationValidation;

  if (!isParentInvitation(validInvitation)) {
    return { ok: false, error: "This invitation is invalid." };
  }

  if (validInvitation.role !== UserRole.PARENT) {
    return { ok: false, error: "This invitation is invalid." };
  }

  const existingMembership = await prisma.familyMembership.findUnique({
    where: { userId: parentUser.id },
    select: { status: true },
  });

  if (existingMembership) {
    return { ok: false, error: "You already belong to a family." };
  }

  try {
    const familyId = await prisma.$transaction(async (tx) => {
      const claimed = await tx.invitation.updateMany({
        where: {
          id: validInvitation.id,
          acceptedAt: null,
          expiresAt: { gt: new Date() },
        },
        data: { acceptedAt: new Date() },
      });

      if (claimed.count === 0) {
        throw new Error("INVITATION_ALREADY_USED");
      }

      await tx.familyMembership.create({
        data: {
          familyId: validInvitation.familyId,
          userId: parentUser.id,
        },
      });

      return validInvitation.familyId;
    });

    return { ok: true, familyId };
  } catch (error) {
    if (error instanceof Error && error.message === "INVITATION_ALREADY_USED") {
      return { ok: false, error: "This invitation has already been used." };
    }

    return { ok: false, error: "Could not join family. Please try again." };
  }
}
