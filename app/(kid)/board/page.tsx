import { ActiveTaskList } from "@/components/tasks/ActiveTaskList";
import { BalanceSummary } from "@/components/child/BalanceSummary";
import { ChoreList } from "@/components/chores/ChoreList";
import { CreateProposalForm } from "@/components/child/CreateProposalForm";
import { MyProposalsList } from "@/components/child/MyProposalsList";
import { KidBoardLayout } from "@/components/layout/KidBoardLayout";
import { getKidBoardData } from "@/lib/kid-board-queries";
import { getKidProposalsData } from "@/lib/kid-proposal-queries";

export const dynamic = "force-dynamic";

export default async function BoardPage() {
  const [{ earningsTotal, paidTotal, availableChores, activeChores }, { proposals }] =
    await Promise.all([getKidBoardData(), getKidProposalsData()]);

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
