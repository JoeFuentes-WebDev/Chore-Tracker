import { CardSection } from "@/components/ui/Card";

export function ArchivedMembershipEmptyState() {
  return (
    <CardSection aria-label="Archived membership">
      <p className="text-lg font-medium">Access archived</p>
      <p className="mt-2 text-sm text-muted-foreground">
        You are no longer an active member of this household. Historical data is
        preserved, but you cannot participate until access is restored.
      </p>
    </CardSection>
  );
}
