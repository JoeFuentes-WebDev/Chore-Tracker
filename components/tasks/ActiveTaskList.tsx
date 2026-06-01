"use client";

import { ChoreCard } from "@/components/chores/ChoreCard";
import type { KidBoardChore } from "@/lib/kid-board-types";

export interface ActiveTaskListProps {
  chores: KidBoardChore[];
}

export function ActiveTaskList({ chores }: ActiveTaskListProps) {
  return (
    <section aria-label="My chores">
      <h2 className="mb-3 text-lg font-semibold">My chores</h2>
      {chores.length === 0 ? (
        <p className="text-sm text-muted-foreground">You have no active chores.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {chores.map((chore) => (
            <ChoreCard key={chore.id} chore={chore} showStatus />
          ))}
        </ul>
      )}
    </section>
  );
}
