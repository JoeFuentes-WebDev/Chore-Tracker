import { CardSection } from "@/components/ui/Card";
import { CreateFamilyForm } from "@/components/parent/CreateFamilyForm";

export function NoFamilyEmptyState() {
  return (
    <div className="flex flex-col gap-6">
      <CardSection aria-label="No family">
        <p className="text-lg font-medium">No family found.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          You don&apos;t belong to a family yet.
        </p>
      </CardSection>
      <CreateFamilyForm />
    </div>
  );
}
