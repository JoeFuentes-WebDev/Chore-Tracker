"use server";

import { revalidatePath } from "next/cache";

import { approveChoreById } from "@/lib/approve-chore";

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
