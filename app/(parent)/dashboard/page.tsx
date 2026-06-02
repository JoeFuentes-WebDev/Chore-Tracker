import { ParentDashboardLayout } from "@/components/layout/ParentDashboardLayout";
import { CreateChoreForm } from "@/components/parent/CreateChoreForm";
import { PendingApprovalList } from "@/components/parent/PendingApprovalList";
import { getParentDashboardData } from "@/lib/parent-dashboard-queries";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { pendingChores } = await getParentDashboardData();

  return (
    <ParentDashboardLayout>
      <CreateChoreForm />
      <PendingApprovalList chores={pendingChores} />
    </ParentDashboardLayout>
  );
}
