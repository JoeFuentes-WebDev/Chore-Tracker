import { MembershipStatus, UserRole } from "@prisma/client";

import { countActiveParents } from "@/lib/membership/active-membership";
import { prisma } from "@/lib/prisma";

export type ArchiveFamilyMembershipResult =
  | { ok: true }
  | { ok: false; error: string };

/** Archive a child or parent membership — preserves history, no deletes. */
export async function archiveFamilyMembership(
  actorFamilyId: string,
  targetUserId: string,
): Promise<ArchiveFamilyMembershipResult> {
  const membership = await prisma.familyMembership.findUnique({
    where: { userId: targetUserId },
    include: { user: { select: { role: true } } },
  });

  if (!membership || membership.familyId !== actorFamilyId) {
    return { ok: false, error: "Member not found in this family." };
  }

  if (membership.status !== MembershipStatus.ACTIVE) {
    return { ok: false, error: "Member is already archived." };
  }

  if (membership.user.role === UserRole.PARENT) {
    const activeParentCount = await countActiveParents(actorFamilyId);

    if (activeParentCount <= 1) {
      return { ok: false, error: "Cannot archive the last active parent." };
    }
  }

  await prisma.familyMembership.update({
    where: { id: membership.id },
    data: {
      status: MembershipStatus.ARCHIVED,
      archivedAt: new Date(),
    },
  });

  return { ok: true };
}
