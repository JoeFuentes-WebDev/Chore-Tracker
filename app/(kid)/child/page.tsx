import { redirect } from "next/navigation";

import { ChildSessionEmptyState } from "@/components/child/ChildSessionEmptyState";
import { KidBoardClient } from "@/components/child/KidBoardClient";
import { KidBoardLayout } from "@/components/layout/KidBoardLayout";
import { getCurrentChildContext } from "@/lib/auth/get-current-child-context";
import { getKidHistoryData } from "@/lib/kid-history-queries";
import { getKidBoardData } from "@/lib/kid-board-queries";
import { getKidProposalsData } from "@/lib/kid-proposal-queries";

export const dynamic = "force-dynamic";

export default async function ChildPage() {
  const context = await getCurrentChildContext();

  if (context.kind === "demo-expired") {
    redirect("/demo/init");
  }

  if (context.kind === "unauthenticated") {
    return (
      <KidBoardLayout>
        <ChildSessionEmptyState />
      </KidBoardLayout>
    );
  }

  const { user, familyId } = context;

  const [
    { earningsTotal, paidTotal, availableChores, activeChores },
    { proposals },
    { historyChores, lifetimeEarningsTotal },
  ] = await Promise.all([
    getKidBoardData({ familyId, childUserId: user.id }),
    getKidProposalsData({ childUserId: user.id, familyId }),
    getKidHistoryData({ familyId, childUserId: user.id }),
  ]);

  return (
    <KidBoardLayout>
      <KidBoardClient
        earningsTotal={earningsTotal}
        paidTotal={paidTotal}
        availableChores={availableChores}
        activeChores={activeChores}
        proposals={proposals}
        historyChores={historyChores}
        lifetimeEarningsTotal={lifetimeEarningsTotal}
      />
    </KidBoardLayout>
  );
}
