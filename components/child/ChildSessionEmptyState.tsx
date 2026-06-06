import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { CardSection } from "@/components/ui/Card";

export function ChildSessionEmptyState() {
  return (
    <CardSection aria-label="Child session required">
      <p className="text-lg font-medium">Join your family</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Open the invite link from your parent to set up your account and access
        your chore board.
      </p>
      <Link href="/" className="mt-4 block">
        <Button variant="secondary" className="w-full">
          Back to home
        </Button>
      </Link>
    </CardSection>
  );
}
