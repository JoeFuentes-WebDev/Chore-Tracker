import { MembershipStatus, UserRole } from "@prisma/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { acceptInvitationByToken } from "@/lib/accept-invitation";
import { acceptParentInvitationByToken } from "@/lib/accept-parent-invitation";
import { acceptRecoveryInvitationByToken } from "@/lib/accept-recovery-invitation";
import { getClerkParentUser } from "@/lib/auth/get-clerk-parent-user";
import { createRecoveryInvitation } from "@/lib/create-recovery-invitation";
import { prisma } from "@/lib/prisma";
import { validateRecoveryInvitationForAccept } from "@/lib/invitations/validate-recovery-invitation";

import {
  createTestBundle,
  createTestChildMember,
  createTestFamily,
  createTestInvitation,
  createTestParentMember,
  createTestUser,
  teardownTestBundle,
  trackFamily,
  trackUser,
} from "../helpers/fixtures";

vi.mock("@/lib/auth/get-clerk-parent-user", () => ({
  getClerkParentUser: vi.fn(),
}));

const describeWithDb = describe.skipIf(!process.env.DATABASE_URL);
const mockedGetClerkParentUser = vi.mocked(getClerkParentUser);

describeWithDb("invitation accept flows", () => {
  const bundle = createTestBundle();

  afterEach(async () => {
    vi.clearAllMocks();
    await teardownTestBundle(bundle);
    bundle.familyIds.length = 0;
    bundle.userIds.length = 0;
  });

  it("accepts a net-new child invitation and creates user, membership, and legacy child", async () => {
    const familyId = await createTestFamily();
    trackFamily(bundle, familyId);
    const invitation = await createTestInvitation(familyId, { role: UserRole.CHILD });

    const result = await acceptInvitationByToken({
      token: invitation.token,
      name: "Jamie",
      pin: "1234",
      confirmPin: "1234",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    bundle.userIds.push(result.userId);

    const userCount = await prisma.user.count({ where: { id: result.userId } });
    const membershipCount = await prisma.familyMembership.count({
      where: { userId: result.userId, familyId },
    });
    const legacyChildCount = await prisma.child.count({ where: { id: result.userId } });

    expect(userCount).toBe(1);
    expect(membershipCount).toBe(1);
    expect(legacyChildCount).toBe(1);
  });

  it("rejects accepting the same child invitation twice", async () => {
    const familyId = await createTestFamily();
    trackFamily(bundle, familyId);
    const invitation = await createTestInvitation(familyId, { role: UserRole.CHILD });

    const first = await acceptInvitationByToken({
      token: invitation.token,
      name: "Jamie",
      pin: "1234",
      confirmPin: "1234",
    });
    expect(first.ok).toBe(true);
    if (first.ok) {
      bundle.userIds.push(first.userId);
    }

    const second = await acceptInvitationByToken({
      token: invitation.token,
      name: "Alex",
      pin: "5678",
      confirmPin: "5678",
    });
    expect(second).toEqual({
      ok: false,
      error: "This invitation has already been used.",
    });
  });

  it("recovery accept restores access without creating duplicate records", async () => {
    const familyId = await createTestFamily();
    trackFamily(bundle, familyId);
    const child = await createTestChildMember(familyId, { name: "Existing Child" });
    trackUser(bundle, child);

    const invite = await createRecoveryInvitation(familyId, child.id);
    expect(invite.ok).toBe(true);
    if (!invite.ok) {
      return;
    }

    const usersBefore = await prisma.user.count();
    const result = await acceptRecoveryInvitationByToken(invite.token);
    expect(result).toEqual({ ok: true, userId: child.id });

    const usersAfter = await prisma.user.count();
    expect(usersAfter).toBe(usersBefore);
  });

  it("blocks recovery invitations for archived children", async () => {
    const familyId = await createTestFamily();
    trackFamily(bundle, familyId);
    const parent = await createTestParentMember(familyId);
    trackUser(bundle, parent);
    const child = await createTestChildMember(familyId, {
      status: MembershipStatus.ARCHIVED,
    });
    trackUser(bundle, child);

    const invite = await createRecoveryInvitation(familyId, child.id);
    expect(invite).toEqual({
      ok: false,
      error: "This child is no longer active in the family.",
    });
  });

  it("blocks recovery validation for archived children", async () => {
    const familyId = await createTestFamily();
    trackFamily(bundle, familyId);
    const child = await createTestChildMember(familyId, {
      status: MembershipStatus.ARCHIVED,
    });
    trackUser(bundle, child);

    const invitation = await createTestInvitation(familyId, {
      role: UserRole.CHILD,
      userId: child.id,
    });

    const validation = await validateRecoveryInvitationForAccept(invitation);
    expect(validation).toEqual({
      ok: false,
      error: "This invitation is no longer valid.",
    });
  });

  it("accepts a parent invitation for a signed-in parent without an existing membership", async () => {
    const familyId = await createTestFamily();
    trackFamily(bundle, familyId);
    const invitation = await createTestInvitation(familyId, { role: UserRole.PARENT });
    const parent = await createTestUser(UserRole.PARENT, { name: "Invited Parent" });
    trackUser(bundle, parent);
    mockedGetClerkParentUser.mockResolvedValue(parent);

    const result = await acceptParentInvitationByToken(invitation.token);
    expect(result).toEqual({ ok: true, familyId });

    const membership = await prisma.familyMembership.findUnique({
      where: { userId: parent.id },
    });
    expect(membership?.familyId).toBe(familyId);
    expect(membership?.status).toBe(MembershipStatus.ACTIVE);
  });

  it("blocks parent invitation when parent already has a membership", async () => {
    const familyId = await createTestFamily();
    trackFamily(bundle, familyId);
    const existingParent = await createTestParentMember(familyId);
    trackUser(bundle, existingParent);

    const otherFamily = await createTestFamily("Other family");
    trackFamily(bundle, otherFamily);
    const invitation = await createTestInvitation(otherFamily, { role: UserRole.PARENT });
    mockedGetClerkParentUser.mockResolvedValue(existingParent);

    const result = await acceptParentInvitationByToken(invitation.token);
    expect(result).toEqual({
      ok: false,
      error: "You already belong to a family.",
    });
  });
});
