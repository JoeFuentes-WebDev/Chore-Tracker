"use client";

import { PendingApprovalCard } from "@/components/parent/PendingApprovalCard";
import type { ParentPendingChore } from "@/lib/parent-dashboard-types";

export interface PendingApprovalListProps {
  chores: ParentPendingChore[];
}

export function PendingApprovalList({ chores }: PendingApprovalListProps) {
  return (
    <section aria-label="Pending approvals">
      <h2 className="mb-3 text-lg font-semibold">Pending approvals</h2>
      {chores.length === 0 ? (
        <p className="text-sm text-muted-foreground">No chores awaiting approval.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {chores.map((chore) => (
            <PendingApprovalCard key={chore.id} chore={chore} />
          ))}
        </ul>
      )}
    </section>
  );
}
