"use server";

import { revalidatePath } from "next/cache";

import { approveChoreById } from "@/lib/approve-chore";
import { rejectChoreById } from "@/lib/reject-chore";

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
