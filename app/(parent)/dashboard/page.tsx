import { redirect } from "next/navigation";

import { getCurrentParentContext } from "@/lib/auth/get-parent-family-context";
import {
  getParentDashboardPath,
  getParentSignInPath,
} from "@/lib/auth/parent-auth-paths";

export const dynamic = "force-dynamic";

/** Legacy route — redirects to /parent. */
export default async function LegacyDashboardPage() {
  const context = await getCurrentParentContext();

  if (context.kind === "anonymous") {
    redirect(getParentSignInPath());
  }

  redirect(getParentDashboardPath());
}
