import { ChildSessionEmptyState } from "@/components/child/ChildSessionEmptyState";
import { ActiveTaskList } from "@/components/tasks/ActiveTaskList";
import { BalanceSummary } from "@/components/child/BalanceSummary";
import { ChoreList } from "@/components/chores/ChoreList";
import { CreateProposalForm } from "@/components/child/CreateProposalForm";
import { MyProposalsList } from "@/components/child/MyProposalsList";
import { KidBoardLayout } from "@/components/layout/KidBoardLayout";
import { getCurrentChildContext } from "@/lib/auth/get-current-child-context";
import { getKidBoardData } from "@/lib/kid-board-queries";
import { getKidProposalsData } from "@/lib/kid-proposal-queries";

export const dynamic = "force-dynamic";

export default async function BoardPage() {
  const context = await getCurrentChildContext();

  if (context.kind === "unauthenticated") {
    return (
      <KidBoardLayout>
        <ChildSessionEmptyState />
      </KidBoardLayout>
    );
  }

  const { user, familyId } = context;

  const [{ earningsTotal, paidTotal, availableChores, activeChores }, { proposals }] =
    await Promise.all([
      getKidBoardData({ familyId, childUserId: user.id }),
      getKidProposalsData({ childUserId: user.id, familyId }),
    ]);

  return (
    <KidBoardLayout>
      <BalanceSummary outstandingTotal={earningsTotal} paidTotal={paidTotal} />
      <ChoreList chores={availableChores} />
      <ActiveTaskList chores={activeChores} />
      <CreateProposalForm />
      <MyProposalsList proposals={proposals} />
    </KidBoardLayout>
  );
}
