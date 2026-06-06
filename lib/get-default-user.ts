import { UserRole, type User } from "@prisma/client";

import { getChildSessionUser } from "@/lib/auth/get-child-session-user";
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

/** Child user from session cookie, or V1 shim fallback. */
export async function getChildUserForBoard(): Promise<User> {
  const sessionUser = await getChildSessionUser();

  if (sessionUser) {
    return sessionUser;
  }

  return getDefaultChildUser();
}

export interface ChildBoardContext {
  user: User;
  familyId: string;
}

/** Resolve child user and family for the kid board. */
export async function getChildBoardContext(): Promise<ChildBoardContext> {
  const user = await getChildUserForBoard();
  const membership = await prisma.familyMembership.findUnique({
    where: { userId: user.id },
    select: { familyId: true },
  });

  const familyId = membership?.familyId ?? (await getDefaultFamily()).id;

  return { user, familyId };
}
