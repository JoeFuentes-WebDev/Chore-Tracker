import type { User } from "@prisma/client";

import { getChildSessionUser } from "@/lib/auth/get-child-session-user";
import { getClerkParentUser } from "@/lib/auth/get-clerk-parent-user";

/** Session user eligible for push subscription (parent or child). */
export async function getNotificationSessionUser(): Promise<User | null> {
  const parentUser = await getClerkParentUser();

  if (parentUser) {
    return parentUser;
  }

  return getChildSessionUser();
}
