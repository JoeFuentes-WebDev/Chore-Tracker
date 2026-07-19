import type { User } from "@prisma/client";
import { MembershipStatus } from "@prisma/client";

import { getDemoContext } from "@/lib/demo/get-demo-context";
import { getChildSessionUser } from "@/lib/auth/get-child-session-user";
import { prisma } from "@/lib/prisma";

export type ChildContext =
  | { kind: "unauthenticated" }
  | { kind: "demo-expired" }
  | { kind: "resolved"; user: User; familyId: string };

export type RequireChildContextResult =
  | { ok: true; user: User; familyId: string }
  | { ok: false; error: string };

/** Resolve child session cookie to user and family membership. */

export async function getCurrentChildContext(): Promise<ChildContext> {
  // Real child session takes priority over demo
  const user = await getChildSessionUser();

  if (user) {
    const membership = await prisma.familyMembership.findUnique({
      where: { userId: user.id },
      select: { familyId: true, status: true },
    });

    if (membership && membership.status === MembershipStatus.ACTIVE) {
      return {
        kind: "resolved",
        user,
        familyId: membership.familyId,
      };
    }
  }

  // Fall through to demo only if no real session
  const demo = await getDemoContext();

  if (demo.kind === "active") {
    return {
      kind: "resolved",
      user: demo.childUser,
      familyId: demo.familyId,
    };
  }

  if (demo.kind === "expired") {
    return { kind: "demo-expired" };
  }

  return { kind: "unauthenticated" };
}

/** Strict child + family resolution for mutations and scoped queries. */
export async function requireCurrentChildContext(): Promise<RequireChildContextResult> {
  const context = await getCurrentChildContext();

  if (context.kind === "demo-expired") {
    return { ok: false, error: "Your demo session expired. Start again at /demo." };
  }

  if (context.kind === "unauthenticated") {
    return { ok: false, error: "Join your family using an invite link." };
  }

  return {
    ok: true,
    user: context.user,
    familyId: context.familyId,
  };
}
