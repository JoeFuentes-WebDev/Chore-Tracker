"use client";

import { AcceptProposalButton } from "@/components/parent/AcceptProposalButton";
import { DenyProposalButton } from "@/components/parent/DenyProposalButton";
import { ProposalStatus } from "@/lib/types";
import type { ParentReviewProposal } from "@/lib/parent-dashboard-types";
import { cn, formatReward } from "@/lib/utils";

export interface ProposalReviewCardProps {
  proposal: ParentReviewProposal;
}

const STATUS_LABELS: Record<ProposalStatus, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  COUNTERED: "Countered",
  REJECTED: "Denied",
};

function formatCreatedAt(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function ProposalReviewCard({ proposal }: ProposalReviewCardProps) {
  const isPending = proposal.status === ProposalStatus.PENDING;

  return (
    <li className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-medium">{proposal.name}</p>
          {proposal.description ? (
            <p className="mt-1 text-sm text-muted-foreground">{proposal.description}</p>
          ) : null}
          <p className="mt-2 text-sm text-muted-foreground">{proposal.childName}</p>
        </div>
        <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-sm font-medium tabular-nums">
          {formatReward(proposal.askingReward)}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
            "bg-muted text-muted-foreground",
          )}
        >
          {STATUS_LABELS[proposal.status]}
        </span>
        <span className="text-xs text-muted-foreground">
          Submitted {formatCreatedAt(proposal.createdAt)}
        </span>
      </div>
      {isPending ? (
        <div className="mt-3 flex gap-3">
          <AcceptProposalButton proposalId={proposal.id} />
          <DenyProposalButton proposalId={proposal.id} />
        </div>
      ) : null}
    </li>
  );
}
