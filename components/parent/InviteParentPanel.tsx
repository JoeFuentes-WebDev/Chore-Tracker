"use client";

import { useState, useTransition } from "react";

import { createParentInvitation } from "@/app/(parent)/parent/actions";
import { InviteLinkResult } from "@/components/shared/InviteLinkResult";
import { Button } from "@/components/ui/Button";
import { CardSection } from "@/components/ui/Card";
import { FormMessage } from "@/components/ui/FormField";

export function InviteParentPanel() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  function handleInviteClick() {
    setError(null);
    setCopyMessage(null);

    startTransition(async () => {
      const result = await createParentInvitation();

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
    <CardSection aria-label="Invite parent">
      <p className="text-lg font-medium">Invite a parent</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Generate a link for another parent to join this family.
      </p>
      <div className="mt-4 flex flex-col gap-3">
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleInviteClick}
          disabled={isPending}
        >
          {isPending ? "Generating…" : "Invite parent"}
        </Button>
        {error ? <FormMessage variant="error">{error}</FormMessage> : null}
        {inviteUrl ? (
          <InviteLinkResult
            inviteUrl={inviteUrl}
            expiresAt={expiresAt}
            onCopy={handleCopyClick}
            copyMessage={copyMessage}
          />
        ) : null}
      </div>
    </CardSection>
  );
}
