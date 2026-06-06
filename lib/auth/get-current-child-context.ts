import type { User } from "@prisma/client";

import { getChildSessionUser } from "@/lib/auth/get-child-session-user";
import { prisma } from "@/lib/prisma";

export type ChildContext =
  | { kind: "unauthenticated" }
  | { kind: "resolved"; user: User; familyId: string };

export type RequireChildContextResult =
  | { ok: true; user: User; familyId: string }
  | { ok: false; error: string };

/** Resolve child session cookie to user and family membership. */
export async function getCurrentChildContext(): Promise<ChildContext> {
  const user = await getChildSessionUser();

  if (!user) {
    return { kind: "unauthenticated" };
  }

  const membership = await prisma.familyMembership.findUnique({
    where: { userId: user.id },
    select: { familyId: true },
  });

  if (!membership) {
    return { kind: "unauthenticated" };
  }

  return {
    kind: "resolved",
    user,
    familyId: membership.familyId,
  };
}

/** Strict child + family resolution for mutations and scoped queries. */
export async function requireCurrentChildContext(): Promise<RequireChildContextResult> {
  const context = await getCurrentChildContext();

  if (context.kind === "unauthenticated") {
    return { ok: false, error: "Join your family using an invite link." };
  }

  return {
    ok: true,
    user: context.user,
    familyId: context.familyId,
  };
}
