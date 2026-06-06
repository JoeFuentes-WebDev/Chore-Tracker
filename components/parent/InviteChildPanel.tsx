"use client";

import { useState, useTransition } from "react";

import { createChildInvitation } from "@/app/(parent)/parent/actions";
import { Button } from "@/components/ui/Button";
import { CardSection } from "@/components/ui/Card";
import { FormMessage } from "@/components/ui/FormField";

function formatExpiryDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function InviteChildPanel() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  function handleInviteClick() {
    setError(null);
    setCopyMessage(null);

    startTransition(async () => {
      const result = await createChildInvitation();

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setInviteUrl(result.inviteUrl);
      setExpiresAt(result.expiresAt);
    });
  }

  async function handleCopyClick() {
    if (!inviteUrl) {
      return;
    }

    setCopyMessage(null);

    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopyMessage("Link copied.");
    } catch {
      setCopyMessage("Could not copy link.");
    }
  }

  return (
    <CardSection aria-label="Invite child">
      <p className="text-lg font-medium">Invite a child</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Generate a link for your child to join this family.
      </p>
      <div className="mt-4 flex flex-col gap-3">
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleInviteClick}
          disabled={isPending}
        >
          {isPending ? "Generating…" : "Invite child"}
        </Button>
        {error ? <FormMessage variant="error">{error}</FormMessage> : null}
        {inviteUrl ? (
          <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-3">
            <p className="text-xs font-medium text-muted-foreground">Invite link</p>
            <p className="break-all text-sm">{inviteUrl}</p>
            {expiresAt ? (
              <p className="text-xs text-muted-foreground">
                Expires {formatExpiryDate(expiresAt)}
              </p>
            ) : null}
            <Button variant="primary" size="sm" className="w-full" onClick={handleCopyClick}>
              Copy link
            </Button>
            {copyMessage ? <FormMessage variant="success">{copyMessage}</FormMessage> : null}
          </div>
        ) : null}
      </div>
    </CardSection>
  );
}
