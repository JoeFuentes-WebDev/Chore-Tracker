"use client";

import { useRouter } from "next/navigation";

import { acceptProposal, denyProposal } from "@/app/(parent)/dashboard/actions";
import { AsyncActionButton } from "@/components/ui/AsyncActionButton";
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
  const router = useRouter();
  const isPending = proposal.status === ProposalStatus.PENDING;

  function handleAcceptSuccess() {
    router.refresh();
  }

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
          <AsyncActionButton
            className="flex-1"
            action={() => acceptProposal(proposal.id)}
            idleLabel="Accept"
            pendingLabel="Accepting…"
            variant="success"
            onSuccess={handleAcceptSuccess}
          />
          <AsyncActionButton
            className="flex-1"
            action={() => denyProposal(proposal.id)}
            idleLabel="Deny"
            pendingLabel="Denying…"
            variant="secondary"
          />
        </div>
      ) : null}
    </li>
  );
}
