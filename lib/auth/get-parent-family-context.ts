import type { User } from "@prisma/client";
import { MembershipStatus } from "@prisma/client";

import { getDemoContext } from "@/lib/demo/get-demo-context";
import { getClerkParentUser } from "@/lib/auth/get-clerk-parent-user";
import { prisma } from "@/lib/prisma";

export type ParentFamilyContext =
  | { kind: "anonymous" }
  | { kind: "demo-expired" }
  | { kind: "no-family"; parentUser: User }
  | { kind: "archived"; parentUser: User }
  | { kind: "authenticated"; parentUser: User; familyId: string };

export type RequireParentFamilyResult =
  | { ok: true; user: User; familyId: string }
  | { ok: false; error: string };

/** Resolve Clerk parent session and family membership for dashboard rendering. */
export async function getCurrentParentContext(): Promise<ParentFamilyContext> {
  const demo = await getDemoContext();

  if (demo.kind === "active") {
    return {
      kind: "authenticated",
      parentUser: demo.parentUser,
      familyId: demo.familyId,
    };
  }

  if (demo.kind === "expired") {
    return { kind: "demo-expired" };
  }

  const parentUser = await getClerkParentUser();

  if (!parentUser) {
    return { kind: "anonymous" };
  }

  const membership = await prisma.familyMembership.findUnique({
    where: { userId: parentUser.id },
    select: { familyId: true, status: true },
  });

  if (!membership) {
    return { kind: "no-family", parentUser };
  }

  if (membership.status === MembershipStatus.ARCHIVED) {
    return { kind: "archived", parentUser };
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

  if (context.kind === "demo-expired") {
    return { ok: false, error: "Your demo session expired. Start again at /demo." };
  }

  if (context.kind === "anonymous") {
    return { ok: false, error: "Sign in to continue." };
  }

  if (context.kind === "no-family") {
    return { ok: false, error: "Create a family to continue." };
  }

  if (context.kind === "archived") {
    return { ok: false, error: "Your membership was archived." };
  }

  return {
    ok: true,
    user: context.parentUser,
    familyId: context.familyId,
  };
}
