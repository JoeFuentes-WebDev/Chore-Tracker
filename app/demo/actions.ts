"use server";

import { redirect } from "next/navigation";

import { clearDemoSession } from "@/lib/demo/demo-session";

export async function startDemoOver(): Promise<void> {
  await clearDemoSession();
  redirect("/demo/init");
}
