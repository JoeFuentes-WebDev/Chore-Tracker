import { redirect } from "next/navigation";

import { getParentDashboardPath } from "@/lib/auth/parent-auth-paths";

export const dynamic = "force-dynamic";

/** Legacy slug route — redirects to /parent. */
export default async function LegacyParentSlugPage() {
  redirect(getParentDashboardPath());
}
