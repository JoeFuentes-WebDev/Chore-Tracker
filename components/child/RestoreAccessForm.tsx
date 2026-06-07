"use client";

import { useState, useTransition } from "react";

import { acceptRecoveryInvitation } from "@/app/invite/[token]/actions";
import { Button } from "@/components/ui/Button";
import { FormMessage, FormSection } from "@/components/ui/FormField";

export interface RestoreAccessFormProps {
  token: string;
  childName: string;
}

export function RestoreAccessForm({ token, childName }: RestoreAccessFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleContinueClick() {
    setError(null);

    startTransition(async () => {
      const result = await acceptRecoveryInvitation(token);

      if (result?.ok === false) {
        setError(result.error);
      }
    });
  }

  return (
    <FormSection title="Welcome back" ariaLabel="Restore child access">
      <p className="text-sm text-muted-foreground">
        Hi {childName}! Tap continue to connect this device to your chore board.
      </p>
      {error ? <FormMessage variant="error">{error}</FormMessage> : null}
      <Button
        variant="primary"
        className="mt-4 w-full"
        onClick={handleContinueClick}
        disabled={isPending}
      >
        {isPending ? "Connecting…" : "Continue"}
      </Button>
    </FormSection>
  );
}
