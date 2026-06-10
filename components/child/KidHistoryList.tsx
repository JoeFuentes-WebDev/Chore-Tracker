"use client";

import type { KidHistoryChore } from "@/lib/kid-history-types";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  RewardPill,
} from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ChoreStatus } from "@/lib/constants/statuses";

export interface KidHistoryListProps {
  chores: KidHistoryChore[];
}

function formatCompletedDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function KidHistoryList({ chores }: KidHistoryListProps) {
  return (
    <section aria-label="Earnings history">
      <h2 className="mb-3 text-lg font-semibold">Completed chores</h2>
      {chores.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No approved chores yet. Finish chores to see them here.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {chores.map((chore) => (
            <Card key={chore.id}>
              <CardHeader>
                <CardTitle>
                  <p className="font-medium">{chore.name}</p>
                  {chore.description ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {chore.description}
                    </p>
                  ) : null}
                </CardTitle>
                <RewardPill amount={chore.reward} />
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge
                    type="chore"
                    status={ChoreStatus.APPROVED}
                  />
                  <StatusBadge
                    label={chore.paid ? "Paid" : "Unpaid"}
                  />
                  <span className="text-xs text-muted-foreground">
                    {formatCompletedDate(chore.completedAt)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </ul>
      )}
    </section>
  );
}
