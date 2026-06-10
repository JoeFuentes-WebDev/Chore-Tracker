"use server";

import { redirect } from "next/navigation";

import { clearDemoSession, setDemoSessionFamilyId } from "@/lib/demo/demo-session";
import { getDemoContext } from "@/lib/demo/get-demo-context";
import { seedDemoFamily } from "@/lib/demo/seed-demo-family";

export async function initializeDemoSession(): Promise<void> {
  const demo = await getDemoContext();

  if (demo.kind !== "active") {
    const { familyId } = await seedDemoFamily();
    await setDemoSessionFamilyId(familyId);
  }

  redirect("/demo");
}

export async function startDemoOver(): Promise<void> {
  await clearDemoSession();
  redirect("/demo");
}
