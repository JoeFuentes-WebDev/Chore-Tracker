"use client";

export interface EarningsSummaryProps {
  /**
   * Optional pre-computed total. When omitted, the component derives the total
   * from GET /api/tasks?status=APPROVED (sum of Task.reward).
   */
  total?: number;
}

// shadcn: Card. Displays total approved earnings.
export function EarningsSummary(_props: EarningsSummaryProps) {
  // TODO: fetch/sum approved task rewards, handle loading/error, show total.
  return null;
}
