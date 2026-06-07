"use server";

import { claimChoreForChild } from "@/lib/claim-chore";
import { requireCurrentChildContext } from "@/lib/auth/get-current-child-context";
import {
  revalidateChildBoard,
  revalidateParentDashboard,
} from "@/lib/cache/revalidate-surfaces";
import {
  createProposalForChild,
  type CreateProposalInput,
} from "@/lib/create-proposal";
import { finishChoreForChild } from "@/lib/finish-chore";
import {
  dispatchChoreCompleted,
  dispatchProposalSubmitted,
} from "@/lib/notifications/dispatch";
import { startChoreForChild } from "@/lib/start-chore";

export async function claimChore(choreId: string): Promise<
  | { ok: true }
  | { ok: false; error: string }
> {
  try {
    const child = await requireCurrentChildContext();

    if (!child.ok) {
      return child;
    }

    const result = await claimChoreForChild(choreId, child.user.id, {
      familyId: child.familyId,
    });

    if (!result.ok) {
      return result;
    }

    revalidateChildBoard();
    revalidateParentDashboard();
    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

export async function startChore(choreId: string): Promise<
  | { ok: true }
  | { ok: false; error: string }
> {
  try {
    const child = await requireCurrentChildContext();

    if (!child.ok) {
      return child;
    }

    const result = await startChoreForChild(choreId, child.user.id, {
      familyId: child.familyId,
    });

    if (!result.ok) {
      return result;
    }

    revalidateChildBoard();
    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

export async function finishChore(choreId: string): Promise<
  | { ok: true }
  | { ok: false; error: string }
> {
  try {
    const child = await requireCurrentChildContext();

    if (!child.ok) {
      return child;
    }

    const result = await finishChoreForChild(choreId, child.user.id, {
      familyId: child.familyId,
    });

    if (!result.ok) {
      return result;
    }

    void dispatchChoreCompleted(child.familyId, choreId, child.user.id).catch(() => {});

    revalidateChildBoard();
    revalidateParentDashboard();
    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

export async function createProposal(input: CreateProposalInput): Promise<
  | { ok: true; proposalId: string }
  | { ok: false; error: string }
> {
  try {
    const child = await requireCurrentChildContext();

    if (!child.ok) {
      return child;
    }

    const result = await createProposalForChild(input, {
      childUserId: child.user.id,
      familyId: child.familyId,
    });

    if (!result.ok) {
      return result;
    }

    void dispatchProposalSubmitted(child.familyId, result.proposalId).catch(() => {});

    revalidateChildBoard();
    revalidateParentDashboard();
    return result;
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}
