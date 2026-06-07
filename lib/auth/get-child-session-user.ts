import { UserRole, type User } from "@prisma/client";
import { cookies } from "next/headers";

import { CHILD_SESSION_COOKIE } from "@/lib/auth/child-session";
import { prisma } from "@/lib/prisma";

/** Returns the child User from the session cookie, or null if unset. */
export async function getChildSessionUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(CHILD_SESSION_COOKIE)?.value;

  if (!userId) {
    return null;
  }

  return prisma.user.findFirst({
    where: {
      id: userId,
      role: UserRole.CHILD,
    },
  });
}
