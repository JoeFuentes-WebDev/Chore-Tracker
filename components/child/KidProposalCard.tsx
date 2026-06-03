"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  RewardPill,
} from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { KidProposal } from "@/lib/kid-proposal-types";

export interface KidProposalCardProps {
  proposal: KidProposal;
}

export function KidProposalCard({ proposal }: KidProposalCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <p className="font-medium">{proposal.name}</p>
        </CardTitle>
        <RewardPill amount={proposal.askingReward} />
      </CardHeader>
      <CardContent>
        <StatusBadge type="proposal" status={proposal.status} />
      </CardContent>
    </Card>
  );
}
