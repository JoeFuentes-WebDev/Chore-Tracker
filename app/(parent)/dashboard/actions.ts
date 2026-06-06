"use server";

import { revalidatePath } from "next/cache";

import { acceptProposalById } from "@/lib/accept-proposal";
import { approveChoreById } from "@/lib/approve-chore";
import { createChore as createChoreRecord, type CreateChoreInput } from "@/lib/create-chore";
import {
  createFamilyForUser,
  type CreateFamilyInput,
} from "@/lib/create-family";
import { getClerkParentUser } from "@/lib/auth/get-clerk-parent-user";
import { getParentFamilyContext } from "@/lib/auth/get-parent-family-context";
import { denyProposalById } from "@/lib/deny-proposal";
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

    revalidatePath("/dashboard");
    return result;
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

export async function approveChore(choreId: string): Promise<
  | { ok: true }
  | { ok: false; error: string }
> {
  try {
    const result = await approveChoreById(choreId);

    if (!result.ok) {
      return result;
    }

    revalidatePath("/dashboard");
    revalidatePath("/board");
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
    const result = await rejectChoreById(choreId);

    if (!result.ok) {
      return result;
    }

    revalidatePath("/dashboard");
    revalidatePath("/board");
    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

export async function createChore(input: CreateChoreInput): Promise<
  | { ok: true; choreId: string }
  | { ok: false; error: string }
> {
  try {
    const context = await getParentFamilyContext();
    const familyId =
      context.kind === "authenticated" ? context.familyId : undefined;

    const result = await createChoreRecord({
      ...input,
      familyId,
    });

    if (!result.ok) {
      return result;
    }

    revalidatePath("/board");
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
    const result = await acceptProposalById(proposalId);

    if (!result.ok) {
      return result;
    }

    revalidatePath("/dashboard");
    revalidatePath("/board");
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
    const result = await denyProposalById(proposalId);

    if (!result.ok) {
      return result;
    }

    revalidatePath("/dashboard");
    revalidatePath("/board");
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
    const result = await settleApprovedBalance();

    if (!result.ok) {
      return result;
    }

    revalidatePath("/dashboard");
    revalidatePath("/board");
    return result;
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}
