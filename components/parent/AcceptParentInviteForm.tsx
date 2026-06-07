"use client";

import { useState, useTransition } from "react";

import { acceptParentInvitation } from "@/app/invite/[token]/actions";
import { Button } from "@/components/ui/Button";
import { FormMessage } from "@/components/ui/FormField";

export interface AcceptParentInviteFormProps {
  token: string;
}

export function AcceptParentInviteForm({ token }: AcceptParentInviteFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleAcceptClick() {
    setError(null);

    startTransition(async () => {
      const result = await acceptParentInvitation(token);

      if (result && !result.ok) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        You&apos;re signed in. Join this family to access the parent dashboard.
      </p>
      <Button
        variant="primary"
        className="w-full"
        onClick={handleAcceptClick}
        disabled={isPending}
      >
        {isPending ? "Joining…" : "Join family"}
      </Button>
      {error ? <FormMessage variant="error">{error}</FormMessage> : null}
    </div>
  );
}
