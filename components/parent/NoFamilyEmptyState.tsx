import { CardSection } from "@/components/ui/Card";

export function NoFamilyEmptyState() {
  return (
    <CardSection aria-label="No family">
      <p className="text-lg font-medium">No family found.</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Family creation arrives in V2-M3.
      </p>
    </CardSection>
  );
}
