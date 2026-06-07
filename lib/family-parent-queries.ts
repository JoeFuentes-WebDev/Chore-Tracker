import { UserRole } from "@prisma/client";

import { ACTIVE_MEMBERSHIP_WHERE } from "@/lib/membership/active-membership";
import { prisma } from "@/lib/prisma";

export interface FamilyCoParentListItem {
  id: string;
  name: string;
}

/** Active co-parents in a family, excluding the current parent. */
export async function getFamilyCoParents(
  familyId: string,
  excludeUserId: string,
): Promise<FamilyCoParentListItem[]> {
  const memberships = await prisma.familyMembership.findMany({
    where: {
      familyId,
      ...ACTIVE_MEMBERSHIP_WHERE,
      userId: { not: excludeUserId },
      user: { role: UserRole.PARENT },
    },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { user: { name: "asc" } },
  });

  return memberships.map((membership) => ({
    id: membership.user.id,
    name: membership.user.name,
  }));
}
