"use server";

import { revalidatePath } from "next/cache";

import { acceptProposalById } from "@/lib/accept-proposal";
import { approveChoreById } from "@/lib/approve-chore";
import { createChore as createChoreRecord, type CreateChoreInput } from "@/lib/create-chore";
import { denyProposalById } from "@/lib/deny-proposal";
import { rejectChoreById } from "@/lib/reject-chore";
import { settleApprovedBalance } from "@/lib/settle-balance";

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
    const result = await createChoreRecord(input);

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
