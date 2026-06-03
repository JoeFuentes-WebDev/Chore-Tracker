"use client";

import { CardSection } from "@/components/ui/Card";
import { formatReward } from "@/lib/utils";

export interface BalanceSummaryProps {
  /** Sum of APPROVED + unpaid chores (TD-13). */
  outstandingTotal: number;
  /** Sum of APPROVED + paid chores. */
  paidTotal: number;
}

export function BalanceSummary({ outstandingTotal, paidTotal }: BalanceSummaryProps) {
  return (
    <CardSection aria-label="Balance">
      <p className="text-sm text-muted-foreground">Outstanding balance</p>
      <p className="text-3xl font-semibold tabular-nums">
        {formatReward(outstandingTotal)}
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        Paid total:{" "}
        <span className="font-medium tabular-nums text-foreground">
          {formatReward(paidTotal)}
        </span>
      </p>
    </CardSection>
  );
}
