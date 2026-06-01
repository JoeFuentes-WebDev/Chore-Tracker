"use client";

import { ClaimChoreButton } from "@/components/chores/ClaimChoreButton";
import { StartChoreButton } from "@/components/chores/StartChoreButton";
import { ChoreStatus } from "@/lib/types";
import type { KidBoardChore } from "@/lib/kid-board-types";
import { cn, formatReward } from "@/lib/utils";

export interface ChoreCardProps {
  chore: KidBoardChore;
  /** When true, shows the chore status badge (used on the active chores list). */
  showStatus?: boolean;
  /** When true, shows a Claim action (available chores on the kid board). */
  claimable?: boolean;
  /** When true, shows a Start action for CLAIMED chores on the active list. */
  startable?: boolean;
}

const STATUS_LABELS: Record<ChoreStatus, string> = {
  AVAILABLE: "Available",
  CLAIMED: "Claimed",
  IN_PROGRESS: "In progress",
  PENDING_APPROVAL: "Pending approval",
  APPROVED: "Approved",
};

export function ChoreCard({
  chore,
  showStatus = false,
  claimable = false,
  startable = false,
}: ChoreCardProps) {
  return (
    <li className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-medium">{chore.name}</p>
          {chore.description ? (
            <p className="mt-1 text-sm text-muted-foreground">{chore.description}</p>
          ) : null}
        </div>
        <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-sm font-medium tabular-nums">
          {formatReward(chore.reward)}
        </span>
      </div>
      {showStatus ? (
        <span
          className={cn(
            "mt-3 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
            "bg-muted text-muted-foreground",
          )}
        >
          {STATUS_LABELS[chore.status]}
        </span>
      ) : null}
      {claimable ? <ClaimChoreButton choreId={chore.id} /> : null}
      {startable ? <StartChoreButton choreId={chore.id} /> : null}
    </li>
  );
}
