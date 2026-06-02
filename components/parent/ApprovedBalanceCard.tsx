"use client";

import { PayBalanceButton } from "@/components/parent/PayBalanceButton";
import type { ParentApprovedBalance } from "@/lib/parent-dashboard-types";
import { formatReward } from "@/lib/utils";

export interface ApprovedBalanceCardProps {
  balance: ParentApprovedBalance;
}

export function ApprovedBalanceCard({ balance }: ApprovedBalanceCardProps) {
  const hasBalance = balance.choreCount > 0 && balance.total > 0;

  return (
    <section
      aria-label="Approved balance"
      className="rounded-xl border border-border bg-card p-4"
    >
      <p className="text-sm text-muted-foreground">Approved balance</p>
      <p className="text-3xl font-semibold tabular-nums">{formatReward(balance.total)}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Approved chores: {balance.choreCount}
      </p>
      <div className="mt-4">
        <PayBalanceButton balanceTotal={balance.total} disabled={!hasBalance} />
      </div>
    </section>
  );
}
