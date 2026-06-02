"use client";

import { ProposalStatus } from "@/lib/types";
import type { KidProposal } from "@/lib/kid-proposal-types";
import { cn, formatReward } from "@/lib/utils";

export interface KidProposalCardProps {
  proposal: KidProposal;
}

const STATUS_LABELS: Record<ProposalStatus, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  COUNTERED: "Countered",
  REJECTED: "Denied",
};

export function KidProposalCard({ proposal }: KidProposalCardProps) {
  return (
    <li className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-medium">{proposal.name}</p>
        </div>
        <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-sm font-medium tabular-nums">
          {formatReward(proposal.askingReward)}
        </span>
      </div>
      <span
        className={cn(
          "mt-3 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
          "bg-muted text-muted-foreground",
        )}
      >
        {STATUS_LABELS[proposal.status]}
      </span>
    </li>
  );
}
