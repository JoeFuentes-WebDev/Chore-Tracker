import { ParentDashboardLayout } from "@/components/layout/ParentDashboardLayout";
import { ApprovedBalanceCard } from "@/components/parent/ApprovedBalanceCard";
import { CreateChoreForm } from "@/components/parent/CreateChoreForm";
import { NoFamilyEmptyState } from "@/components/parent/NoFamilyEmptyState";
import { PendingApprovalList } from "@/components/parent/PendingApprovalList";
import { ProposalReviewList } from "@/components/parent/ProposalReviewList";
import { getParentFamilyContext } from "@/lib/auth/get-parent-family-context";
import { getParentDashboardData } from "@/lib/parent-dashboard-queries";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const context = await getParentFamilyContext();

  if (context.kind === "no-family") {
    return (
      <ParentDashboardLayout>
        <NoFamilyEmptyState />
      </ParentDashboardLayout>
    );
  }

  const familyId = context.kind === "authenticated" ? context.familyId : undefined;
  const { pendingChores, proposals, approvedBalance } =
    await getParentDashboardData(familyId);

  return (
    <ParentDashboardLayout>
      <ApprovedBalanceCard balance={approvedBalance} />
      <CreateChoreForm />
      <PendingApprovalList chores={pendingChores} />
      <ProposalReviewList proposals={proposals} />
    </ParentDashboardLayout>
  );
}
