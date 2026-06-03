"use client";

import { claimChore, finishChore, startChore } from "@/app/(kid)/board/actions";
import { AsyncActionButton } from "@/components/ui/AsyncActionButton";
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
  /** When true, shows a Finish action for IN_PROGRESS chores on the active list. */
  finishable?: boolean;
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
  finishable = false,
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
      {claimable ? (
        <AsyncActionButton
          className="mt-3"
          action={() => claimChore(chore.id)}
          idleLabel="Claim"
          pendingLabel="Claiming…"
          variant="primary"
        />
      ) : null}
      {startable ? (
        <AsyncActionButton
          className="mt-3"
          action={() => startChore(chore.id)}
          idleLabel="Start"
          pendingLabel="Starting…"
          variant="primary"
        />
      ) : null}
      {finishable ? (
        <AsyncActionButton
          className="mt-3"
          action={() => finishChore(chore.id)}
          idleLabel="Finish"
          pendingLabel="Submitting…"
          variant="primary"
        />
      ) : null}
    </li>
  );
}
