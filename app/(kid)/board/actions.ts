"use server";

import { revalidatePath } from "next/cache";

import { claimChoreForChild } from "@/lib/claim-chore";
import {
  createProposalForChild,
  type CreateProposalInput,
} from "@/lib/create-proposal";
import { finishChoreForChild } from "@/lib/finish-chore";
import { getChildBoardContext } from "@/lib/get-default-user";
import { startChoreForChild } from "@/lib/start-chore";

export async function claimChore(choreId: string): Promise<
  | { ok: true }
  | { ok: false; error: string }
> {
  try {
    const { user } = await getChildBoardContext();
    const result = await claimChoreForChild(choreId, user.id);

    if (!result.ok) {
      return result;
    }

    revalidatePath("/board");
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
    const { user } = await getChildBoardContext();
    const result = await startChoreForChild(choreId, user.id);

    if (!result.ok) {
      return result;
    }

    revalidatePath("/board");
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
    const { user } = await getChildBoardContext();
    const result = await finishChoreForChild(choreId, user.id);

    if (!result.ok) {
      return result;
    }

    revalidatePath("/board");
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
    const { user, familyId } = await getChildBoardContext();
    const result = await createProposalForChild(input, {
      childUserId: user.id,
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
