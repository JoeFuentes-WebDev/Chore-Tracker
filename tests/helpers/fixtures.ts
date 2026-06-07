import { randomUUID } from "node:crypto";

import {
  ChoreCreator,
  ChoreStatus,
  MembershipStatus,
  UserRole,
  type Invitation,
  type User,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

export interface TestFamilyBundle {
  familyIds: string[];
  userIds: string[];
}

function uniqueSlug(prefix: string): string {
  return `${prefix}-${randomUUID().slice(0, 8)}`;
}

export async function createTestFamily(name = "Test Family"): Promise<string> {
  const family = await prisma.family.create({ data: { name } });
  return family.id;
}

export async function createTestUser(
  role: UserRole,
  overrides: Partial<{ name: string; slug: string; pinHash: string }> = {},
): Promise<User> {
  const prefix = role === UserRole.PARENT ? "parent" : "child";
  return prisma.user.create({
    data: {
      name: overrides.name ?? `Test ${prefix}`,
      slug: overrides.slug ?? uniqueSlug(prefix),
      role,
      pinHash: overrides.pinHash,
    },
  });
}

export async function createActiveMembership(
  familyId: string,
  userId: string,
): Promise<void> {
  await prisma.familyMembership.create({
    data: {
      familyId,
      userId,
      status: MembershipStatus.ACTIVE,
    },
  });
}

export async function createLegacyChildRow(
  userId: string,
  familyId: string,
  name: string,
): Promise<void> {
  await prisma.child.create({
    data: {
      id: userId,
      name,
      familyId,
    },
  });
}

export async function createTestParentMember(
  familyId: string,
  overrides: Partial<{ name: string }> = {},
): Promise<User> {
  const user = await createTestUser(UserRole.PARENT, { name: overrides.name });
  await createActiveMembership(familyId, user.id);
  return user;
}

export async function createTestChildMember(
  familyId: string,
  overrides: Partial<{ name: string; status: MembershipStatus }> = {},
): Promise<User> {
  const user = await createTestUser(UserRole.CHILD, { name: overrides.name });
  await prisma.familyMembership.create({
    data: {
      familyId,
      userId: user.id,
      status: overrides.status ?? MembershipStatus.ACTIVE,
    },
  });
  await createLegacyChildRow(user.id, familyId, user.name);
  return user;
}

export async function createTestInvitation(
  familyId: string,
  options: {
    role: UserRole;
    userId?: string | null;
    expiresAt?: Date;
    acceptedAt?: Date | null;
  },
): Promise<Invitation> {
  return prisma.invitation.create({
    data: {
      familyId,
      userId: options.userId ?? null,
      token: randomUUID(),
      role: options.role,
      expiresAt: options.expiresAt ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      acceptedAt: options.acceptedAt ?? null,
    },
  });
}

export async function createAvailableChore(
  familyId: string,
  overrides: Partial<{ name: string; reward: number }> = {},
): Promise<string> {
  const chore = await prisma.chore.create({
    data: {
      name: overrides.name ?? "Test chore",
      reward: overrides.reward ?? 5,
      status: ChoreStatus.AVAILABLE,
      familyId,
      createdBy: ChoreCreator.PARENT,
    },
  });
  return chore.id;
}

export async function setChoreStatus(
  choreId: string,
  status: ChoreStatus,
  assignedUserId?: string,
): Promise<void> {
  await prisma.chore.update({
    where: { id: choreId },
    data: {
      status,
      assignedUserId: assignedUserId ?? null,
      childId: assignedUserId ?? null,
    },
  });
}

export async function teardownTestBundle(bundle: TestFamilyBundle): Promise<void> {
  for (const familyId of bundle.familyIds) {
    await prisma.family.delete({ where: { id: familyId } }).catch(() => {});
  }

  for (const userId of bundle.userIds) {
    await prisma.user.delete({ where: { id: userId } }).catch(() => {});
  }
}

export function createTestBundle(): TestFamilyBundle {
  return { familyIds: [], userIds: [] };
}

export function trackFamily(bundle: TestFamilyBundle, familyId: string): void {
  bundle.familyIds.push(familyId);
}

export function trackUser(bundle: TestFamilyBundle, user: User): void {
  bundle.userIds.push(user.id);
}
