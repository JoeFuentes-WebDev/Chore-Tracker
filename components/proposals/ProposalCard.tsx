"use client";

import type { Proposal } from "@/lib/types";

export interface ProposalCardProps {
  proposal: Proposal;
  /**
   * "kid" shows a read-only pending proposal; "parent" shows an editable
   * reward input plus Approve/Reject actions. Default "kid".
   */
  variant?: "kid" | "parent";
  /** Parent variant: approve, optionally overriding the reward. */
  onApprove?: (proposal: Proposal, approvedReward?: number) => void;
  /** Parent variant: reject the proposal. */
  onReject?: (proposal: Proposal) => void;
}

// shadcn: Card, Input (parent reward override), Button. Shows name, emoji,
// suggestedReward.
export function ProposalCard(_props: ProposalCardProps) {
  // TODO: render proposal; parent variant exposes reward input + PATCH actions.
  return null;
}
