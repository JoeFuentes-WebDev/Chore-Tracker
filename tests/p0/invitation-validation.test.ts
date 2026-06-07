import { UserRole, type Invitation } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { isParentInvitation } from "@/lib/invitations/is-parent-invitation";
import { isRecoveryInvitation } from "@/lib/invitations/is-recovery-invitation";
import { validateInvitationForAccept } from "@/lib/invitations/validate-invitation";

function buildInvitation(
  overrides: Partial<Invitation> = {},
): Invitation {
  return {
    id: "inv-1",
    familyId: "family-1",
    userId: null,
    token: "token-1",
    role: UserRole.CHILD,
    expiresAt: new Date(Date.now() + 60_000),
    acceptedAt: null,
    createdAt: new Date(),
    ...overrides,
  };
}

describe("validateInvitationForAccept", () => {
  it("rejects a missing invitation", () => {
    const result = validateInvitationForAccept(null);
    expect(result).toEqual({ ok: false, error: "This invitation is invalid." });
  });

  it("rejects an already-used invitation", () => {
    const result = validateInvitationForAccept(
      buildInvitation({ acceptedAt: new Date() }),
    );
    expect(result).toEqual({
      ok: false,
      error: "This invitation has already been used.",
    });
  });

  it("rejects an expired invitation", () => {
    const result = validateInvitationForAccept(
      buildInvitation({ expiresAt: new Date(Date.now() - 1_000) }),
    );
    expect(result).toEqual({
      ok: false,
      error: "This invitation has expired.",
    });
  });

  it("accepts a valid invitation", () => {
    const invitation = buildInvitation();
    const result = validateInvitationForAccept(invitation);
    expect(result).toEqual({ ok: true, invitation });
  });
});

describe("invitation discriminators", () => {
  it("identifies recovery invitations by userId", () => {
    expect(isRecoveryInvitation(buildInvitation({ userId: "child-1" }))).toBe(true);
    expect(isRecoveryInvitation(buildInvitation({ userId: null }))).toBe(false);
  });

  it("identifies net-new parent invitations", () => {
    expect(
      isParentInvitation(
        buildInvitation({ role: UserRole.PARENT, userId: null }),
      ),
    ).toBe(true);
    expect(
      isParentInvitation(
        buildInvitation({ role: UserRole.CHILD, userId: null }),
      ),
    ).toBe(false);
    expect(
      isParentInvitation(
        buildInvitation({ role: UserRole.PARENT, userId: "parent-1" }),
      ),
    ).toBe(false);
  });
});
