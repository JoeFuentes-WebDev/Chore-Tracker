import { ParentDashboardLayout } from "@/components/layout/ParentDashboardLayout";
import { CreateChoreForm } from "@/components/parent/CreateChoreForm";
import { PendingApprovalList } from "@/components/parent/PendingApprovalList";
import { ProposalReviewList } from "@/components/parent/ProposalReviewList";
import { getParentDashboardData } from "@/lib/parent-dashboard-queries";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { pendingChores, proposals } = await getParentDashboardData();

  return (
    <ParentDashboardLayout>
      <CreateChoreForm />
      <PendingApprovalList chores={pendingChores} />
      <ProposalReviewList proposals={proposals} />
    </ParentDashboardLayout>
  );
}
