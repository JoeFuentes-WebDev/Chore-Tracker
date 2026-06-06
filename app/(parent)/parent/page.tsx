import { redirect } from "next/navigation";

import { ParentDashboardLayout } from "@/components/layout/ParentDashboardLayout";
import { ApprovedBalanceCard } from "@/components/parent/ApprovedBalanceCard";
import { CreateChoreForm } from "@/components/parent/CreateChoreForm";
import { InviteChildPanel } from "@/components/parent/InviteChildPanel";
import { ManageChildrenPanel } from "@/components/parent/ManageChildrenPanel";
import { NoFamilyEmptyState } from "@/components/parent/NoFamilyEmptyState";
import { PendingApprovalList } from "@/components/parent/PendingApprovalList";
import { ProposalReviewList } from "@/components/parent/ProposalReviewList";
import { getCurrentParentContext } from "@/lib/auth/get-parent-family-context";
import { getParentSignInPath } from "@/lib/auth/parent-auth-paths";
import { getFamilyChildren } from "@/lib/family-children-queries";
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

  const [familyChildren, { pendingChores, proposals, approvedBalance }] = await Promise.all([
    getFamilyChildren(context.familyId),
    getParentDashboardData(context.familyId),
  ]);

  return (
    <ParentDashboardLayout>
      <ManageChildrenPanel familyChildren={familyChildren} />
      <InviteChildPanel />
      <ApprovedBalanceCard balance={approvedBalance} />
      <CreateChoreForm />
      <PendingApprovalList chores={pendingChores} />
      <ProposalReviewList proposals={proposals} />
    </ParentDashboardLayout>
  );
}
