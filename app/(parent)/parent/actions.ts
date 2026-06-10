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
import { deleteChore as deleteChoreRecord } from "@/lib/delete-chore";
import { updateChore as updateChoreRecord, type UpdateChoreInput } from "@/lib/update-chore";
import { updateParentPhone as updateParentPhoneRecord } from "@/lib/update-parent-phone";
import {
  createFamilyForUser,
  type CreateFamilyInput,
} from "@/lib/create-family";
import { createChildInvitation as createChildInvitationRecord } from "@/lib/create-invitation";
import { createParentInvitation as createParentInvitationRecord } from "@/lib/create-parent-invitation";
import { createRecoveryInvitation } from "@/lib/create-recovery-invitation";
import { archiveFamilyMembership } from "@/lib/archive-family-membership";
import { denyProposalById } from "@/lib/deny-proposal";
import {
  dispatchChoreAssigned,
  dispatchProposalApproved,
  dispatchProposalDenied,
} from "@/lib/notifications/dispatch";
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

export async function createParentInvitation(): Promise<
  | { ok: true; inviteUrl: string; token: string; expiresAt: string }
  | { ok: false; error: string }
> {
  try {
    const parent = await requireCurrentParentFamily();

    if (!parent.ok) {
      return parent;
    }

    const result = await createParentInvitationRecord(parent.familyId);

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

export async function archiveChildMember(childUserId: string): Promise<
  | { ok: true }
  | { ok: false; error: string }
> {
  try {
    const parent = await requireCurrentParentFamily();

    if (!parent.ok) {
      return parent;
    }

    const result = await archiveFamilyMembership(parent.familyId, childUserId);

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

export async function archiveParentMember(parentUserId: string): Promise<
  | { ok: true }
  | { ok: false; error: string }
> {
  try {
    const parent = await requireCurrentParentFamily();

    if (!parent.ok) {
      return parent;
    }

    if (parentUserId === parent.user.id) {
      return { ok: false, error: "You cannot archive yourself." };
    }

    const result = await archiveFamilyMembership(parent.familyId, parentUserId);

    if (!result.ok) {
      return result;
    }

    revalidateParentDashboard();
    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

export async function reinviteChild(childUserId: string): Promise<
  | { ok: true; inviteUrl: string; token: string; expiresAt: string }
  | { ok: false; error: string }
> {
  try {
    const parent = await requireCurrentParentFamily();

    if (!parent.ok) {
      return parent;
    }

    const result = await createRecoveryInvitation(parent.familyId, childUserId);

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

    void dispatchChoreAssigned(parent.familyId, result.choreId).catch(() => {});

    revalidateChildSurfaces();
    revalidateParentDashboard();
    return result;
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

export async function updateChore(
  input: Omit<UpdateChoreInput, "familyId">,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const parent = await requireCurrentParentFamily();

    if (!parent.ok) {
      return parent;
    }

    const result = await updateChoreRecord({
      ...input,
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

export async function deleteChore(choreId: string): Promise<
  | { ok: true }
  | { ok: false; error: string }
> {
  try {
    const parent = await requireCurrentParentFamily();

    if (!parent.ok) {
      return parent;
    }

    const result = await deleteChoreRecord({
      choreId,
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

export async function updateParentPhone(phone: string): Promise<
  | { ok: true }
  | { ok: false; error: string }
> {
  try {
    const parent = await requireCurrentParentFamily();

    if (!parent.ok) {
      return parent;
    }

    const result = await updateParentPhoneRecord({
      userId: parent.user.id,
      phone,
    });

    if (!result.ok) {
      return result;
    }

    revalidateParentDashboard();
    return { ok: true };
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

    void dispatchProposalApproved(proposalId).catch(() => {});

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

    void dispatchProposalDenied(proposalId).catch(() => {});

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
