import { redirect } from "next/navigation";

import { ParentDashboardLayout } from "@/components/layout/ParentDashboardLayout";
import { ApprovedBalanceCard } from "@/components/parent/ApprovedBalanceCard";
import { ArchiveCoParentPanel } from "@/components/parent/ArchiveCoParentPanel";
import { ArchivedMembershipEmptyState } from "@/components/parent/ArchivedMembershipEmptyState";
import { CreateChoreForm } from "@/components/parent/CreateChoreForm";
import { InviteChildPanel } from "@/components/parent/InviteChildPanel";
import { InviteParentPanel } from "@/components/parent/InviteParentPanel";
import { ManageChildrenPanel } from "@/components/parent/ManageChildrenPanel";
import { NoFamilyEmptyState } from "@/components/parent/NoFamilyEmptyState";
import { PendingApprovalList } from "@/components/parent/PendingApprovalList";
import { ProposalReviewList } from "@/components/parent/ProposalReviewList";
import { getCurrentParentContext } from "@/lib/auth/get-parent-family-context";
import { getParentSignInPath } from "@/lib/auth/parent-auth-paths";
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

  const [familyChildren, coParents, { pendingChores, proposals, approvedBalance }] =
    await Promise.all([
      getFamilyChildren(context.familyId),
      getFamilyCoParents(context.familyId, context.parentUser.id),
      getParentDashboardData(context.familyId),
    ]);

  return (
    <ParentDashboardLayout>
      <ManageChildrenPanel familyChildren={familyChildren} />
      <ArchiveCoParentPanel coParents={coParents} />
      <InviteChildPanel />
      <InviteParentPanel />
      <ApprovedBalanceCard balance={approvedBalance} />
      <CreateChoreForm />
      <PendingApprovalList chores={pendingChores} />
      <ProposalReviewList proposals={proposals} />
    </ParentDashboardLayout>
  );
}
