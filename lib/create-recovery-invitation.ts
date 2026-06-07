import { MembershipStatus, UserRole } from "@prisma/client";
import { randomUUID } from "crypto";

import { prisma } from "@/lib/prisma";

const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type CreateRecoveryInvitationResult =
  | { ok: true; token: string; expiresAt: Date }
  | { ok: false; error: string };

/** Create a single-use recovery invitation for an existing child in the family. */
export async function createRecoveryInvitation(
  familyId: string,
  childUserId: string,
): Promise<CreateRecoveryInvitationResult> {
  const membership = await prisma.familyMembership.findUnique({
    where: { userId: childUserId },
    include: { user: { select: { role: true } } },
  });

  if (!membership || membership.familyId !== familyId) {
    return { ok: false, error: "Child not found in this family." };
  }

  if (membership.user.role !== UserRole.CHILD) {
    return { ok: false, error: "Child not found in this family." };
  }

  if (membership.status !== MembershipStatus.ACTIVE) {
    return { ok: false, error: "This child is no longer active in the family." };
  }

  const expiresAt = new Date(Date.now() + INVITE_TTL_MS);

  const invitation = await prisma.invitation.create({
    data: {
      familyId,
      userId: childUserId,
      token: randomUUID(),
      role: UserRole.CHILD,
      expiresAt,
    },
  });

  return {
    ok: true,
    token: invitation.token,
    expiresAt: invitation.expiresAt,
  };
}
