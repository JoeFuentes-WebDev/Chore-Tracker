"use client";

import { ChoreCard } from "@/components/chores/ChoreCard";
import type { KidBoardChore } from "@/lib/kid-board-types";

export interface ChoreListProps {
  chores: KidBoardChore[];
}

export function ChoreList({ chores }: ChoreListProps) {
  return (
    <section aria-label="Available chores">
      <h2 className="mb-3 text-lg font-semibold">Available chores</h2>
      {chores.length === 0 ? (
        <p className="text-sm text-muted-foreground">No chores available right now.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {chores.map((chore) => (
            <ChoreCard key={chore.id} chore={chore} claimable />
          ))}
        </ul>
      )}
    </section>
  );
}
