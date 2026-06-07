import { MembershipStatus, UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export const ACTIVE_MEMBERSHIP_WHERE = {
  status: MembershipStatus.ACTIVE,
} as const;

/** Count active parent memberships in a family. */
export async function countActiveParents(familyId: string): Promise<number> {
  return prisma.familyMembership.count({
    where: {
      familyId,
      ...ACTIVE_MEMBERSHIP_WHERE,
      user: { role: UserRole.PARENT },
    },
  });
}
