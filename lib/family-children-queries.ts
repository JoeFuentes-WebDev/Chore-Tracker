import { UserRole } from "@prisma/client";

import { ACTIVE_MEMBERSHIP_WHERE } from "@/lib/membership/active-membership";
import { prisma } from "@/lib/prisma";

export interface FamilyChildListItem {
  id: string;
  name: string;
}

/** Children in a family — for parent manage-children UI. */
export async function getFamilyChildren(familyId: string): Promise<FamilyChildListItem[]> {
  const memberships = await prisma.familyMembership.findMany({
    where: {
      familyId,
      ...ACTIVE_MEMBERSHIP_WHERE,
      user: { role: UserRole.CHILD },
    },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { user: { name: "asc" } },
  });

  return memberships.map((membership) => ({
    id: membership.user.id,
    name: membership.user.name,
  }));
}
