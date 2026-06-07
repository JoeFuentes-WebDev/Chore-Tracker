import { MembershipStatus, UserRole } from "@prisma/client";
import { afterEach, describe, expect, it } from "vitest";

import { archiveFamilyMembership } from "@/lib/archive-family-membership";
import { prisma } from "@/lib/prisma";

import {
  createTestBundle,
  createTestChildMember,
  createTestFamily,
  createTestParentMember,
  teardownTestBundle,
  trackFamily,
  trackUser,
} from "../helpers/fixtures";

const describeWithDb = describe.skipIf(!process.env.DATABASE_URL);

describeWithDb("archiveFamilyMembership", () => {
  const bundle = createTestBundle();

  afterEach(async () => {
    await teardownTestBundle(bundle);
    bundle.familyIds.length = 0;
    bundle.userIds.length = 0;
  });

  it("archives an active child and preserves the membership row", async () => {
    const familyId = await createTestFamily();
    trackFamily(bundle, familyId);
    const parent = await createTestParentMember(familyId);
    const child = await createTestChildMember(familyId);
    trackUser(bundle, parent);
    trackUser(bundle, child);

    const result = await archiveFamilyMembership(familyId, child.id);
    expect(result).toEqual({ ok: true });

    const membership = await prisma.familyMembership.findUnique({
      where: { userId: child.id },
    });
    expect(membership?.status).toBe(MembershipStatus.ARCHIVED);
    expect(membership?.archivedAt).not.toBeNull();
    expect(await prisma.user.count({ where: { id: child.id } })).toBe(1);
  });

  it("cannot archive the last active parent", async () => {
    const familyId = await createTestFamily();
    trackFamily(bundle, familyId);
    const parent = await createTestParentMember(familyId);
    trackUser(bundle, parent);

    const result = await archiveFamilyMembership(familyId, parent.id);
    expect(result).toEqual({
      ok: false,
      error: "Cannot archive the last active parent.",
    });
  });

  it("allows archiving a co-parent when another active parent remains", async () => {
    const familyId = await createTestFamily();
    trackFamily(bundle, familyId);
    const parentA = await createTestParentMember(familyId, { name: "Parent A" });
    const parentB = await createTestParentMember(familyId, { name: "Parent B" });
    trackUser(bundle, parentA);
    trackUser(bundle, parentB);

    const result = await archiveFamilyMembership(familyId, parentB.id);
    expect(result).toEqual({ ok: true });

    const remaining = await prisma.familyMembership.count({
      where: {
        familyId,
        status: MembershipStatus.ACTIVE,
        user: { role: UserRole.PARENT },
      },
    });
    expect(remaining).toBe(1);
  });

  it("rejects archiving a member from another family", async () => {
    const familyA = await createTestFamily("Family A");
    const familyB = await createTestFamily("Family B");
    trackFamily(bundle, familyA);
    trackFamily(bundle, familyB);
    const childA = await createTestChildMember(familyA);
    trackUser(bundle, childA);

    const result = await archiveFamilyMembership(familyB, childA.id);
    expect(result).toEqual({
      ok: false,
      error: "Member not found in this family.",
    });
  });

  it("rejects double-archive", async () => {
    const familyId = await createTestFamily();
    trackFamily(bundle, familyId);
    const parent = await createTestParentMember(familyId);
    const parentB = await createTestParentMember(familyId);
    const child = await createTestChildMember(familyId);
    trackUser(bundle, parent);
    trackUser(bundle, parentB);
    trackUser(bundle, child);

    await archiveFamilyMembership(familyId, child.id);
    const result = await archiveFamilyMembership(familyId, child.id);
    expect(result).toEqual({
      ok: false,
      error: "Member is already archived.",
    });
  });
});
