import { redirect } from "next/navigation";

import { ParentDashboardLayout } from "@/components/layout/ParentDashboardLayout";
import { ApprovedBalanceCard } from "@/components/parent/ApprovedBalanceCard";
import { CreateChoreForm } from "@/components/parent/CreateChoreForm";
import { InviteChildPanel } from "@/components/parent/InviteChildPanel";
import { NoFamilyEmptyState } from "@/components/parent/NoFamilyEmptyState";
import { PendingApprovalList } from "@/components/parent/PendingApprovalList";
import { ProposalReviewList } from "@/components/parent/ProposalReviewList";
import { getCurrentParentContext } from "@/lib/auth/get-parent-family-context";
import {
  getParentDashboardPath,
  getParentSignInPath,
} from "@/lib/auth/parent-auth-paths";
import { getParentDashboardData } from "@/lib/parent-dashboard-queries";

export const dynamic = "force-dynamic";

interface ParentPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ParentPage({ params }: ParentPageProps) {
  const { slug } = await params;
  const context = await getCurrentParentContext();

  if (context.kind === "anonymous") {
    redirect(getParentSignInPath());
  }

  if (slug !== context.parentUser.slug) {
    redirect(getParentDashboardPath(context.parentUser));
  }

  if (context.kind === "no-family") {
    return (
      <ParentDashboardLayout>
        <NoFamilyEmptyState />
      </ParentDashboardLayout>
    );
  }

  const { pendingChores, proposals, approvedBalance } =
    await getParentDashboardData(context.familyId);

  return (
    <ParentDashboardLayout>
      <InviteChildPanel />
      <ApprovedBalanceCard balance={approvedBalance} />
      <CreateChoreForm />
      <PendingApprovalList chores={pendingChores} />
      <ProposalReviewList proposals={proposals} />
    </ParentDashboardLayout>
  );
}
