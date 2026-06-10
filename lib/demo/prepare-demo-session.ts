import { getDemoContext } from "@/lib/demo/get-demo-context";
import { formatDemoInitError } from "@/lib/demo/format-demo-init-error";
import { seedDemoFamily } from "@/lib/demo/seed-demo-family";

export type PrepareDemoSessionResult =
  | { ok: true; familyId: string }
  | { ok: false; error: string; status: number };

export async function prepareDemoSession(): Promise<PrepareDemoSessionResult> {
  if (!process.env.DATABASE_URL) {
    return {
      ok: false,
      error: "Database is not configured for this deployment.",
      status: 503,
    };
  }

  try {
    const demo = await getDemoContext();

    if (demo.kind === "active") {
      return { ok: true, familyId: demo.familyId };
    }

    const { familyId } = await seedDemoFamily();

    return { ok: true, familyId };
  } catch (error) {
    console.error("[demo-init]", error);

    return {
      ok: false,
      error: formatDemoInitError(error),
      status: 500,
    };
  }
}
