"use client";

import { approveChore, rejectChore } from "@/app/(parent)/dashboard/actions";
import { AsyncActionButton } from "@/components/ui/AsyncActionButton";
import type { ParentPendingChore } from "@/lib/parent-dashboard-types";
import { cn, formatReward } from "@/lib/utils";

export interface PendingApprovalCardProps {
  chore: ParentPendingChore;
}

function formatSubmittedAt(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function PendingApprovalCard({ chore }: PendingApprovalCardProps) {
  return (
    <li className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-medium">{chore.name}</p>
          {chore.description ? (
            <p className="mt-1 text-sm text-muted-foreground">{chore.description}</p>
          ) : null}
          <p className="mt-2 text-sm text-muted-foreground">{chore.childName}</p>
        </div>
        <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-sm font-medium tabular-nums">
          {formatReward(chore.reward)}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
            "bg-muted text-muted-foreground",
          )}
        >
          Pending approval
        </span>
        <span className="text-xs text-muted-foreground">
          Submitted {formatSubmittedAt(chore.submittedAt)}
        </span>
      </div>
      <div className="mt-3 flex gap-3">
        <AsyncActionButton
          className="flex-1"
          action={() => approveChore(chore.id)}
          idleLabel="Approve"
          pendingLabel="Approving…"
          variant="success"
        />
        <AsyncActionButton
          className="flex-1"
          action={() => rejectChore(chore.id)}
          idleLabel="Reject"
          pendingLabel="Rejecting…"
          variant="secondary"
        />
      </div>
    </li>
  );
}
