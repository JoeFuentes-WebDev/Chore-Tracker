import type { FamilyChoreLibraryItem } from "@/lib/family-chore-library-types";

import { ChoreLibraryRow } from "@/components/chores/ChoreLibraryRow";

export interface ChoreLibraryListProps {
  chores: FamilyChoreLibraryItem[];
}

export function ChoreLibraryList({ chores }: ChoreLibraryListProps) {
  return (
    <section aria-label="Chore library">
      <h2 className="mb-3 text-lg font-semibold">Chore library</h2>
      {chores.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No chores yet. Create one to get started.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {chores.map((chore) => (
            <ChoreLibraryRow key={chore.id} chore={chore} />
          ))}
        </ul>
      )}
    </section>
  );
}
