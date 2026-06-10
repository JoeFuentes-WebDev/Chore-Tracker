"use server";

import { revalidatePath } from "next/cache";

import { clearDemoSession, setDemoSessionFamilyId } from "@/lib/demo/demo-session";
import { prepareDemoSession } from "@/lib/demo/prepare-demo-session";

export type InitializeDemoSessionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function initializeDemoSession(): Promise<InitializeDemoSessionResult> {
  const result = await prepareDemoSession();

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  try {
    await setDemoSessionFamilyId(result.familyId);
    revalidatePath("/demo");
    return { ok: true };
  } catch (error) {
    console.error("[demo-init-cookie]", error);

    return {
      ok: false,
      error: "Demo data was created but the session cookie could not be saved.",
    };
  }
}

export async function startDemoOver(): Promise<void> {
  await clearDemoSession();
  revalidatePath("/demo");
}
