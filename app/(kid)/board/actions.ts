"use server";

import { revalidatePath } from "next/cache";

import { claimChoreForChild } from "@/lib/claim-chore";
import { getDefaultChild } from "@/lib/get-default-child";

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
