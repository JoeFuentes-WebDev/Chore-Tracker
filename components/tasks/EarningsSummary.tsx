"use client";

import { formatReward } from "@/lib/utils";

export interface EarningsSummaryProps {
  /** Unpaid approved earnings total (TD-13). Passed from the server. */
  total: number;
}

export function EarningsSummary({ total }: EarningsSummaryProps) {
  return (
    <section
      aria-label="Earnings"
      className="rounded-xl border border-border bg-card p-4"
    >
      <p className="text-sm text-muted-foreground">You&apos;ve earned</p>
      <p className="text-3xl font-semibold tabular-nums">{formatReward(total)}</p>
    </section>
  );
}
