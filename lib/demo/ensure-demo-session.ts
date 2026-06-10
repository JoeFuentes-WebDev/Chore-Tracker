import { setDemoSessionFamilyId } from "@/lib/demo/demo-session";
import { getDemoContext } from "@/lib/demo/get-demo-context";
import { seedDemoFamily } from "@/lib/demo/seed-demo-family";

/** Create or reuse a demo family and persist the session cookie (route/action only). */
export async function ensureDemoSession(): Promise<string> {
  const demo = await getDemoContext();

  if (demo.kind === "active") {
    return demo.familyId;
  }

  const { familyId } = await seedDemoFamily();
  await setDemoSessionFamilyId(familyId);

  return familyId;
}
