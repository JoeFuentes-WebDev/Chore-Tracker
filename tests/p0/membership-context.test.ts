import { MembershipStatus } from "@prisma/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { getCurrentChildContext } from "@/lib/auth/get-current-child-context";
import { getChildSessionUser } from "@/lib/auth/get-child-session-user";
import { getCurrentParentContext } from "@/lib/auth/get-parent-family-context";
import { getClerkParentUser } from "@/lib/auth/get-clerk-parent-user";
import { archiveFamilyMembership } from "@/lib/archive-family-membership";
import {
  getFamilyChildUserIds,
  getFamilyParentUserIds,
} from "@/lib/notifications/resolve-recipients";

import {
  createTestBundle,
  createTestChildMember,
  createTestFamily,
  createTestParentMember,
  teardownTestBundle,
  trackFamily,
  trackUser,
} from "../helpers/fixtures";

vi.mock("@/lib/auth/get-clerk-parent-user", () => ({
  getClerkParentUser: vi.fn(),
}));

vi.mock("@/lib/auth/get-child-session-user", () => ({
  getChildSessionUser: vi.fn(),
}));

const describeWithDb = describe.skipIf(!process.env.DATABASE_URL);
const mockedGetClerkParentUser = vi.mocked(getClerkParentUser);
const mockedGetChildSessionUser = vi.mocked(getChildSessionUser);

describeWithDb("membership context and recipient filtering", () => {
  const bundle = createTestBundle();

  afterEach(async () => {
    vi.clearAllMocks();
    await teardownTestBundle(bundle);
    bundle.familyIds.length = 0;
    bundle.userIds.length = 0;
  });

  it("resolves active parent context", async () => {
    const familyId = await createTestFamily();
    trackFamily(bundle, familyId);
    const parent = await createTestParentMember(familyId);
    trackUser(bundle, parent);
    mockedGetClerkParentUser.mockResolvedValue(parent);

    const context = await getCurrentParentContext();
    expect(context).toEqual({
      kind: "authenticated",
      parentUser: parent,
      familyId,
    });
  });

  it("returns archived kind for archived parent membership", async () => {
    const familyId = await createTestFamily();
    trackFamily(bundle, familyId);
    const parentA = await createTestParentMember(familyId);
    const parentB = await createTestParentMember(familyId);
    trackUser(bundle, parentA);
    trackUser(bundle, parentB);

    await archiveFamilyMembership(familyId, parentB.id);
    mockedGetClerkParentUser.mockResolvedValue(parentB);

    const context = await getCurrentParentContext();
    expect(context.kind).toBe("archived");
    if (context.kind === "archived") {
      expect(context.parentUser.id).toBe(parentB.id);
    }
  });

  it("rejects archived child session as unauthenticated", async () => {
    const familyId = await createTestFamily();
    trackFamily(bundle, familyId);
    await createTestParentMember(familyId);
    const child = await createTestChildMember(familyId, {
      status: MembershipStatus.ARCHIVED,
    });
    trackUser(bundle, child);
    mockedGetChildSessionUser.mockResolvedValue(child);

    const context = await getCurrentChildContext();
    expect(context).toEqual({ kind: "unauthenticated" });
  });

  it("excludes archived members from notification recipient lists", async () => {
    const familyId = await createTestFamily();
    trackFamily(bundle, familyId);
    const parent = await createTestParentMember(familyId);
    const coParent = await createTestParentMember(familyId);
    const child = await createTestChildMember(familyId);
    trackUser(bundle, parent);
    trackUser(bundle, coParent);
    trackUser(bundle, child);

    await archiveFamilyMembership(familyId, coParent.id);
    await archiveFamilyMembership(familyId, child.id);

    const parentIds = await getFamilyParentUserIds(familyId);
    const childIds = await getFamilyChildUserIds(familyId);

    expect(parentIds).toEqual([parent.id]);
    expect(childIds).toEqual([]);
  });
});
