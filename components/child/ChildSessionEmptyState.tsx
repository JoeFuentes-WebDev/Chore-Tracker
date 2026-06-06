import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { CardSection } from "@/components/ui/Card";

export function ChildSessionEmptyState() {
  return (
    <CardSection aria-label="Child session required">
      <p className="text-lg font-medium">Device not connected</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Looks like this device is not connected to a child account yet. Ask your
        parent for an invite or reinvite link.
      </p>
      <Link href="/" className="mt-4 block">
        <Button variant="secondary" className="w-full">
          Back to home
        </Button>
      </Link>
    </CardSection>
  );
}
