import { redirect } from "next/navigation";

import { ParentDashboardLayout } from "@/components/layout/ParentDashboardLayout";
import { ArchivedMembershipEmptyState } from "@/components/parent/ArchivedMembershipEmptyState";
import { NoFamilyEmptyState } from "@/components/parent/NoFamilyEmptyState";
import { ParentDashboardClient } from "@/components/parent/ParentDashboardClient";
import { getCurrentParentContext } from "@/lib/auth/get-parent-family-context";
import { getParentSignInPath } from "@/lib/auth/parent-auth-paths";
import { getFamilyChoreLibrary } from "@/lib/family-chore-library-queries";
import { getFamilyChildren } from "@/lib/family-children-queries";
import { getFamilyCoParents } from "@/lib/family-parent-queries";
import { getParentDashboardData } from "@/lib/parent-dashboard-queries";

export const dynamic = "force-dynamic";

export default async function ParentPage() {
  const context = await getCurrentParentContext();

  if (context.kind === "anonymous") {
    redirect(getParentSignInPath());
  }

  if (context.kind === "no-family") {
    return (
      <ParentDashboardLayout>
        <NoFamilyEmptyState />
      </ParentDashboardLayout>
    );
  }

  if (context.kind === "archived") {
    return (
      <ParentDashboardLayout>
        <ArchivedMembershipEmptyState />
      </ParentDashboardLayout>
    );
  }

  const [familyChildren, coParents, libraryChores, { pendingChores, proposals, approvedBalance }] =
    await Promise.all([
      getFamilyChildren(context.familyId),
      getFamilyCoParents(context.familyId, context.parentUser.id),
      getFamilyChoreLibrary(context.familyId),
      getParentDashboardData(context.familyId),
    ]);

  return (
    <ParentDashboardLayout>
      <ParentDashboardClient
        familyChildren={familyChildren}
        coParents={coParents}
        pendingChores={pendingChores}
        proposals={proposals}
        approvedBalance={approvedBalance}
        libraryChores={libraryChores}
        parentPhone={context.parentUser.phone}
      />
    </ParentDashboardLayout>
  );
}
