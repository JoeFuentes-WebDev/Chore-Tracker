import type { User } from "@prisma/client";

import { getClerkParentUser } from "@/lib/auth/get-clerk-parent-user";
import { prisma } from "@/lib/prisma";

export type ParentFamilyContext =
  | { kind: "anonymous" }
  | { kind: "no-family"; parentUser: User }
  | { kind: "authenticated"; parentUser: User; familyId: string };

/** Resolve Clerk parent session and family membership for dashboard rendering. */
export async function getParentFamilyContext(): Promise<ParentFamilyContext> {
  const parentUser = await getClerkParentUser();

  if (!parentUser) {
    return { kind: "anonymous" };
  }

  const membership = await prisma.familyMembership.findUnique({
    where: { userId: parentUser.id },
    select: { familyId: true },
  });

  if (!membership) {
    return { kind: "no-family", parentUser };
  }

  return {
    kind: "authenticated",
    parentUser,
    familyId: membership.familyId,
  };
}
