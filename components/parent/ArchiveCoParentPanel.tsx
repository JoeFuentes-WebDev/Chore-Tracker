import type { FamilyCoParentListItem } from "@/lib/family-parent-queries";

import { ArchiveCoParentRow } from "@/components/parent/ArchiveCoParentRow";
import { CardSection } from "@/components/ui/Card";

export interface ArchiveCoParentPanelProps {
  coParents: FamilyCoParentListItem[];
}

export function ArchiveCoParentPanel({ coParents }: ArchiveCoParentPanelProps) {
  if (coParents.length === 0) {
    return null;
  }

  return (
    <CardSection aria-label="Manage co-parents">
      <p className="text-lg font-medium">Co-parents</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Archive a co-parent who no longer participates in this household.
      </p>
      <div className="mt-4 flex flex-col gap-3">
        {coParents.map((coParent) => (
          <ArchiveCoParentRow
            key={coParent.id}
            parentId={coParent.id}
            parentName={coParent.name}
          />
        ))}
      </div>
    </CardSection>
  );
}
