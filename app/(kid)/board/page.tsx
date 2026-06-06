import { redirect } from "next/navigation";

import { ChildSessionEmptyState } from "@/components/child/ChildSessionEmptyState";
import { KidBoardLayout } from "@/components/layout/KidBoardLayout";
import { getCurrentChildContext } from "@/lib/auth/get-current-child-context";
import { getChildBoardPath } from "@/lib/auth/child-auth-paths";

export const dynamic = "force-dynamic";

/** Legacy route — redirects to /child when session exists. */
export default async function LegacyBoardPage() {
  const context = await getCurrentChildContext();

  if (context.kind === "unauthenticated") {
    return (
      <KidBoardLayout>
        <ChildSessionEmptyState />
      </KidBoardLayout>
    );
  }

  redirect(getChildBoardPath());
}
