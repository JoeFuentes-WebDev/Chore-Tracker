"use client";

import { useRouter } from "next/navigation";

import { acceptProposal, denyProposal } from "@/app/(parent)/dashboard/actions";
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
import { ProposalStatus } from "@/lib/types";
import type { ParentReviewProposal } from "@/lib/parent-dashboard-types";

export interface ProposalReviewCardProps {
  proposal: ParentReviewProposal;
}

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
    <Card>
      <CardHeader>
        <CardTitle>
          <p className="font-medium">{proposal.name}</p>
          {proposal.description ? (
            <p className="mt-1 text-sm text-muted-foreground">{proposal.description}</p>
          ) : null}
          <p className="mt-2 text-sm text-muted-foreground">{proposal.childName}</p>
        </CardTitle>
        <RewardPill amount={proposal.askingReward} />
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-2">
        <StatusBadge type="proposal" status={proposal.status} />
        <span className="text-xs text-muted-foreground">
          Submitted {formatCreatedAt(proposal.createdAt)}
        </span>
      </CardContent>
      {isPending ? (
        <CardFooter>
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
        </CardFooter>
      ) : null}
    </Card>
  );
}
