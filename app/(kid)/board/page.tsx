import { ActiveTaskList } from "@/components/tasks/ActiveTaskList";
import { EarningsSummary } from "@/components/tasks/EarningsSummary";
import { ChoreList } from "@/components/chores/ChoreList";
import { KidBoardLayout } from "@/components/layout/KidBoardLayout";
import { getKidBoardData } from "@/lib/kid-board-queries";

export const dynamic = "force-dynamic";

export default async function BoardPage() {
  const { earningsTotal, availableChores, activeChores } = await getKidBoardData();

  return (
    <KidBoardLayout>
      <EarningsSummary total={earningsTotal} />
      <ChoreList chores={availableChores} />
      <ActiveTaskList chores={activeChores} />
    </KidBoardLayout>
  );
}
