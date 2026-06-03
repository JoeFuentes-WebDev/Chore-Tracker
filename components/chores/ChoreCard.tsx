"use client";

import { claimChore, finishChore, startChore } from "@/app/(kid)/board/actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  RewardPill,
} from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AsyncActionButton } from "@/components/ui/AsyncActionButton";

import type { KidBoardChore } from "@/lib/kid-board-types";

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

export function ChoreCard({
  chore,
  showStatus = false,
  claimable = false,
  startable = false,
  finishable = false,
}: ChoreCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <p className="font-medium">{chore.name}</p>
          {chore.description ? (
            <p className="mt-1 text-sm text-muted-foreground">{chore.description}</p>
          ) : null}
        </CardTitle>
        <RewardPill amount={chore.reward} />
      </CardHeader>
      {showStatus ? (
        <CardContent>
          <StatusBadge type="chore" status={chore.status} />
        </CardContent>
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
    </Card>
  );
}
