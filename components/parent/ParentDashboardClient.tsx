"use client";

import { useEffect, useState } from "react";

import { ArchiveCoParentPanel } from "@/components/parent/ArchiveCoParentPanel";
import { ApprovedBalanceCard } from "@/components/parent/ApprovedBalanceCard";
import { CreateChoreForm } from "@/components/parent/CreateChoreForm";
import { InviteChildPanel } from "@/components/parent/InviteChildPanel";
import { InviteParentPanel } from "@/components/parent/InviteParentPanel";
import { ManageChildrenPanel } from "@/components/parent/ManageChildrenPanel";
import { PendingApprovalList } from "@/components/parent/PendingApprovalList";
import { ProposalReviewList } from "@/components/parent/ProposalReviewList";
import { ChoreLibraryList } from "@/components/chores/ChoreLibraryList";
import { BottomNav, type ParentTabId } from "@/components/layout/BottomNav";
import { SettingsForm } from "@/components/settings/SettingsForm";
import type { FamilyChoreLibraryItem } from "@/lib/family-chore-library-types";
import type { FamilyChildListItem } from "@/lib/family-children-queries";
import type { FamilyCoParentListItem } from "@/lib/family-parent-queries";
import type {
  ParentApprovedBalance,
  ParentPendingChore,
  ParentReviewProposal,
} from "@/lib/parent-dashboard-types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface ParentDashboardClientProps {
  familyChildren: FamilyChildListItem[];
  coParents: FamilyCoParentListItem[];
  pendingChores: ParentPendingChore[];
  proposals: ParentReviewProposal[];
  approvedBalance: ParentApprovedBalance;
  libraryChores: FamilyChoreLibraryItem[];
  parentPhone: string | null;
}

export function ParentDashboardClient({
  familyChildren,
  coParents,
  pendingChores,
  proposals,
  approvedBalance,
  libraryChores,
  parentPhone,
}: ParentDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<ParentTabId>("review");
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (activeTab !== "manage") {
      setShowCreateForm(false);
    }
  }, [activeTab]);

  function handleTabChange(tab: string) {
    setActiveTab(tab as ParentTabId);
  }

  function handleCreateClick() {
    setShowCreateForm(true);
  }

  function handleCreateClose() {
    setShowCreateForm(false);
  }

  return (
    <>
      <div className={cn(activeTab === "review" ? "block" : "hidden")}>
        <h1 className="text-2xl font-semibold">Review</h1>
        <div className="mt-6">
          <ApprovedBalanceCard balance={approvedBalance} />
        </div>
        <div className="mt-6">
          <ChoreLibraryList chores={libraryChores} />
        </div>
        <div className="mt-6">
          <PendingApprovalList chores={pendingChores} />
        </div>
        <div className="mt-6">
          <ProposalReviewList proposals={proposals} />
        </div>
      </div>

      <div className={cn(activeTab === "manage" ? "block" : "hidden")}>
        <h1 className="text-2xl font-semibold">Manage</h1>
        <div className="mt-4">
          {showCreateForm ? null : (
            <Button type="button" variant="primary" className="w-full" onClick={handleCreateClick}>
              + Create Chore
            </Button>
          )}
        </div>
        {showCreateForm ? (
          <div className="mt-4">
            <CreateChoreForm onClose={handleCreateClose} />
          </div>
        ) : null}
        <div className="mt-6">
          <ManageChildrenPanel familyChildren={familyChildren} />
        </div>
        <div className="mt-6">
          <InviteChildPanel />
        </div>
        <div className="mt-6">
          <InviteParentPanel />
        </div>
        <div className="mt-6">
          <ArchiveCoParentPanel coParents={coParents} />
        </div>
      </div>

      <div className={cn(activeTab === "settings" ? "block" : "hidden")}>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <div className="mt-6">
          <SettingsForm initialPhone={parentPhone} />
        </div>
      </div>

      <BottomNav mode="parent" activeTab={activeTab} onTabChange={handleTabChange} />
    </>
  );
}
