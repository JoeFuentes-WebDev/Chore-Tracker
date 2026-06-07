import type { FamilyChildListItem } from "@/lib/family-children-queries";

import { ReinviteChildRow } from "@/components/parent/ReinviteChildRow";
import { CardSection } from "@/components/ui/Card";

export interface ManageChildrenPanelProps {
  familyChildren: FamilyChildListItem[];
}

export function ManageChildrenPanel({ familyChildren }: ManageChildrenPanelProps) {
  if (familyChildren.length === 0) {
    return null;
  }

  return (
    <CardSection aria-label="Manage children">
      <p className="text-lg font-medium">Manage children</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Reinvite a child to restore access, or archive a child who no longer
        participates.
      </p>
      <div className="mt-4 flex flex-col gap-3">
        {familyChildren.map((child) => (
          <ReinviteChildRow key={child.id} childId={child.id} childName={child.name} />
        ))}
      </div>
    </CardSection>
  );
}
