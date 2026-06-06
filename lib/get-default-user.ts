import { UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";

/** V2-M1 shim: default family until session-scoped auth (V2-M5). */
export async function getDefaultFamily() {
  const family = await prisma.family.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (!family) {
    throw new Error("No family configured");
  }

  return family;
}

/** V2-M1 shim: default child user until session-scoped auth (V2-M5). */
export async function getDefaultChildUser() {
  const family = await getDefaultFamily();
  const membership = await prisma.familyMembership.findFirst({
    where: {
      familyId: family.id,
      user: { role: UserRole.CHILD },
    },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });

  if (!membership) {
    throw new Error("No child user configured");
  }

  return membership.user;
}
