import { redirect } from "next/navigation";

import { getChildBoardPath } from "@/lib/auth/child-auth-paths";

export const dynamic = "force-dynamic";

/** Legacy slug route — redirects to /child. */
export default async function LegacyChildSlugPage() {
  redirect(getChildBoardPath());
}
