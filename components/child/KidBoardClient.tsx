"use client";

import { useState } from "react";

import { BalanceSummary } from "@/components/child/BalanceSummary";
import { CreateProposalForm } from "@/components/child/CreateProposalForm";
import { KidHistoryList } from "@/components/child/KidHistoryList";
import { MyProposalsList } from "@/components/child/MyProposalsList";
import { ChoreList } from "@/components/chores/ChoreList";
import { BottomNav, type KidTabId } from "@/components/layout/BottomNav";
import { ActiveTaskList } from "@/components/tasks/ActiveTaskList";
import { EarningsSummary } from "@/components/tasks/EarningsSummary";
import type { KidHistoryChore } from "@/lib/kid-history-types";
import type { KidBoardChore } from "@/lib/kid-board-types";
import type { KidProposal } from "@/lib/kid-proposal-types";
import { cn } from "@/lib/utils";

export interface KidBoardClientProps {
  earningsTotal: number;
  paidTotal: number;
  availableChores: KidBoardChore[];
  activeChores: KidBoardChore[];
  proposals: KidProposal[];
  historyChores: KidHistoryChore[];
  lifetimeEarningsTotal: number;
}

export function KidBoardClient({
  earningsTotal,
  paidTotal,
  availableChores,
  activeChores,
  proposals,
  historyChores,
  lifetimeEarningsTotal,
}: KidBoardClientProps) {
  const [activeTab, setActiveTab] = useState<KidTabId>("board");

  function handleTabChange(tab: string) {
    setActiveTab(tab as KidTabId);
  }

  return (
    <>
      <div className={cn(activeTab === "board" ? "block" : "hidden")}>
        <BalanceSummary outstandingTotal={earningsTotal} paidTotal={paidTotal} />
        <div className="mt-6">
          <ChoreList chores={availableChores} />
        </div>
        <div className="mt-6">
          <ActiveTaskList chores={activeChores} />
        </div>
      </div>

      <div className={cn(activeTab === "propose" ? "block" : "hidden")}>
        <CreateProposalForm />
        <div className="mt-6">
          <MyProposalsList proposals={proposals} />
        </div>
      </div>

      <div className={cn(activeTab === "history" ? "block" : "hidden")}>
        <EarningsSummary total={lifetimeEarningsTotal} />
        <div className="mt-6">
          <KidHistoryList chores={historyChores} />
        </div>
      </div>

      <BottomNav mode="kid" activeTab={activeTab} onTabChange={handleTabChange} />
    </>
  );
}
