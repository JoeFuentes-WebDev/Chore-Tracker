import type { User } from "@prisma/client";
import { MembershipStatus, UserRole } from "@prisma/client";

import {
  getDemoSessionFamilyId,
} from "@/lib/demo/demo-session";
import { prisma } from "@/lib/prisma";

export type DemoContextResult =
  | { kind: "inactive" }
  | {
      kind: "active";
      familyId: string;
      parentUser: User;
      childUser: User;
    }
  | { kind: "expired" };

/** Resolve demo session cookie to demo family users, or detect a wiped session. */
export async function getDemoContext(): Promise<DemoContextResult> {
  const familyId = await getDemoSessionFamilyId();

  if (!familyId) {
    return { kind: "inactive" };
  }

  const family = await prisma.family.findFirst({
    where: { id: familyId, isDemo: true },
    select: {
      id: true,
      memberships: {
        where: { status: MembershipStatus.ACTIVE },
        include: {
          user: true,
        },
      },
    },
  });

  if (!family) {
    return { kind: "expired" };
  }

  const parentUser = family.memberships.find(
    (membership) => membership.user.role === UserRole.PARENT,
  )?.user;

  const childUser = family.memberships.find(
    (membership) => membership.user.role === UserRole.CHILD,
  )?.user;

  if (!parentUser || !childUser) {
    return { kind: "expired" };
  }

  return {
    kind: "active",
    familyId: family.id,
    parentUser,
    childUser,
  };
}
