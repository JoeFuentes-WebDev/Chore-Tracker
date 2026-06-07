import { UserRole } from "@prisma/client";

import { ACTIVE_MEMBERSHIP_WHERE } from "@/lib/membership/active-membership";
import { prisma } from "@/lib/prisma";

/** Parent user ids in a family. */
export async function getFamilyParentUserIds(familyId: string): Promise<string[]> {
  const memberships = await prisma.familyMembership.findMany({
    where: {
      familyId,
      ...ACTIVE_MEMBERSHIP_WHERE,
      user: { role: UserRole.PARENT },
    },
    select: { userId: true },
  });

  return memberships.map((membership) => membership.userId);
}

/** Child user ids in a family. */
export async function getFamilyChildUserIds(familyId: string): Promise<string[]> {
  const memberships = await prisma.familyMembership.findMany({
    where: {
      familyId,
      ...ACTIVE_MEMBERSHIP_WHERE,
      user: { role: UserRole.CHILD },
    },
    select: { userId: true },
  });

  return memberships.map((membership) => membership.userId);
}
