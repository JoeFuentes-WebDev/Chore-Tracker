"use server";

import { revalidatePath } from "next/cache";

import { claimChoreForChild } from "@/lib/claim-chore";
import { finishChoreForChild } from "@/lib/finish-chore";
import { getDefaultChild } from "@/lib/get-default-child";
import { startChoreForChild } from "@/lib/start-chore";

export async function claimChore(choreId: string): Promise<
  | { ok: true }
  | { ok: false; error: string }
> {
  try {
    const child = await getDefaultChild();
    const result = await claimChoreForChild(choreId, child.id);

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
    const child = await getDefaultChild();
    const result = await startChoreForChild(choreId, child.id);

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
    const child = await getDefaultChild();
    const result = await finishChoreForChild(choreId, child.id);

    if (!result.ok) {
      return result;
    }

    revalidatePath("/board");
    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}
