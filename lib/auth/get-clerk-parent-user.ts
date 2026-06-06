import { auth, currentUser } from "@clerk/nextjs/server";
import type { User } from "@prisma/client";

import { ensureParentUser } from "@/lib/auth/ensure-parent-user";

/** Returns the app User for the signed-in Clerk parent, or null if unauthenticated. */
export async function getClerkParentUser(): Promise<User | null> {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  return ensureParentUser(clerkUser);
}
