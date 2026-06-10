import { redirect } from "next/navigation";

import { ensureDemoSession } from "@/lib/demo/ensure-demo-session";

export const dynamic = "force-dynamic";

/** Seeds demo data and sets the demo_session cookie, then returns to the picker. */
export async function GET() {
  await ensureDemoSession();
  redirect("/demo");
}
