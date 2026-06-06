import type { User } from "@prisma/client";

import { getClerkParentUser } from "@/lib/auth/get-clerk-parent-user";
import { prisma } from "@/lib/prisma";

export type ParentFamilyContext =
  | { kind: "anonymous" }
  | { kind: "no-family"; parentUser: User }
  | { kind: "authenticated"; parentUser: User; familyId: string };

export type RequireParentFamilyResult =
  | { ok: true; user: User; familyId: string }
  | { ok: false; error: string };

/** Resolve Clerk parent session and family membership for dashboard rendering. */
export async function getCurrentParentContext(): Promise<ParentFamilyContext> {
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

/** @deprecated Use getCurrentParentContext — kept for incremental migration. */
export const getParentFamilyContext = getCurrentParentContext;

/** Strict parent + family resolution for mutations and scoped queries. */
export async function requireCurrentParentFamily(): Promise<RequireParentFamilyResult> {
  const context = await getCurrentParentContext();

  if (context.kind === "anonymous") {
    return { ok: false, error: "Sign in to continue." };
  }

  if (context.kind === "no-family") {
    return { ok: false, error: "Create a family to continue." };
  }

  return {
    ok: true,
    user: context.parentUser,
    familyId: context.familyId,
  };
}
