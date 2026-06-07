"use client";

import { approveChore, rejectChore } from "@/app/(parent)/parent/actions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  RewardPill,
} from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AsyncActionButton } from "@/components/ui/AsyncActionButton";
import type { ParentPendingChore } from "@/lib/parent-dashboard-types";

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
    <Card>
      <CardHeader>
        <CardTitle>
          <p className="font-medium">{chore.name}</p>
          {chore.description ? (
            <p className="mt-1 text-sm text-muted-foreground">{chore.description}</p>
          ) : null}
          <p className="mt-2 text-sm text-muted-foreground">{chore.childName}</p>
        </CardTitle>
        <RewardPill amount={chore.reward} />
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-2">
        <StatusBadge label="Pending approval" />
        <span className="text-xs text-muted-foreground">
          Submitted {formatSubmittedAt(chore.submittedAt)}
        </span>
      </CardContent>
      <CardFooter>
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
      </CardFooter>
    </Card>
  );
}
