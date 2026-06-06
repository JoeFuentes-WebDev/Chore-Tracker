"use server";

import { acceptProposalById } from "@/lib/accept-proposal";
import { approveChoreById } from "@/lib/approve-chore";
import { getClerkParentUser } from "@/lib/auth/get-clerk-parent-user";
import { requireCurrentParentFamily } from "@/lib/auth/get-parent-family-context";
import {
  revalidateChildSurfaces,
  revalidateParentDashboard,
} from "@/lib/cache/revalidate-surfaces";
import { createChore as createChoreRecord, type CreateChoreInput } from "@/lib/create-chore";
import {
  createFamilyForUser,
  type CreateFamilyInput,
} from "@/lib/create-family";
import { createChildInvitation as createChildInvitationRecord } from "@/lib/create-invitation";
import { denyProposalById } from "@/lib/deny-proposal";
import { getInviteUrl } from "@/lib/invitations/invite-url";
import { rejectChoreById } from "@/lib/reject-chore";
import { settleApprovedBalance } from "@/lib/settle-balance";

export async function createFamily(input: CreateFamilyInput): Promise<
  | { ok: true; familyId: string }
  | { ok: false; error: string }
> {
  try {
    const parentUser = await getClerkParentUser();

    if (!parentUser) {
      return { ok: false, error: "Sign in to create a family." };
    }

    const result = await createFamilyForUser(parentUser.id, input);

    if (!result.ok) {
      return result;
    }

    revalidateParentDashboard();
    return result;
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

export async function createChildInvitation(): Promise<
  | { ok: true; inviteUrl: string; token: string; expiresAt: string }
  | { ok: false; error: string }
> {
  try {
    const parent = await requireCurrentParentFamily();

    if (!parent.ok) {
      return parent;
    }

    const result = await createChildInvitationRecord(parent.familyId);

    if (!result.ok) {
      return result;
    }

    return {
      ok: true,
      token: result.token,
      inviteUrl: getInviteUrl(result.token),
      expiresAt: result.expiresAt.toISOString(),
    };
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

export async function approveChore(choreId: string): Promise<
  | { ok: true }
  | { ok: false; error: string }
> {
  try {
    const parent = await requireCurrentParentFamily();

    if (!parent.ok) {
      return parent;
    }

    const result = await approveChoreById(choreId, { familyId: parent.familyId });

    if (!result.ok) {
      return result;
    }

    revalidateParentDashboard();
    revalidateChildSurfaces();
    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

export async function rejectChore(choreId: string): Promise<
  | { ok: true }
  | { ok: false; error: string }
> {
  try {
    const parent = await requireCurrentParentFamily();

    if (!parent.ok) {
      return parent;
    }

    const result = await rejectChoreById(choreId, { familyId: parent.familyId });

    if (!result.ok) {
      return result;
    }

    revalidateParentDashboard();
    revalidateChildSurfaces();
    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

export async function createChore(
  input: Omit<CreateChoreInput, "familyId">,
): Promise<
  | { ok: true; choreId: string }
  | { ok: false; error: string }
> {
  try {
    const parent = await requireCurrentParentFamily();

    if (!parent.ok) {
      return parent;
    }

    const result = await createChoreRecord({
      ...input,
      familyId: parent.familyId,
    });

    if (!result.ok) {
      return result;
    }

    revalidateChildSurfaces();
    return result;
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

export async function acceptProposal(proposalId: string): Promise<
  | { ok: true; choreId: string }
  | { ok: false; error: string }
> {
  try {
    const parent = await requireCurrentParentFamily();

    if (!parent.ok) {
      return parent;
    }

    const result = await acceptProposalById(proposalId, {
      familyId: parent.familyId,
    });

    if (!result.ok) {
      return result;
    }

    revalidateParentDashboard();
    revalidateChildSurfaces();
    return result;
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

export async function denyProposal(proposalId: string): Promise<
  | { ok: true }
  | { ok: false; error: string }
> {
  try {
    const parent = await requireCurrentParentFamily();

    if (!parent.ok) {
      return parent;
    }

    const result = await denyProposalById(proposalId, {
      familyId: parent.familyId,
    });

    if (!result.ok) {
      return result;
    }

    revalidateParentDashboard();
    revalidateChildSurfaces();
    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

export async function payBalance(): Promise<
  | { ok: true; settledCount: number }
  | { ok: false; error: string }
> {
  try {
    const parent = await requireCurrentParentFamily();

    if (!parent.ok) {
      return parent;
    }

    const result = await settleApprovedBalance({ familyId: parent.familyId });

    if (!result.ok) {
      return result;
    }

    revalidateParentDashboard();
    revalidateChildSurfaces();
    return result;
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}
