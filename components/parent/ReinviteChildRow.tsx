"use client";

import { useState, useTransition } from "react";

import { reinviteChild } from "@/app/(parent)/parent/actions";
import { ArchiveChildButton } from "@/components/parent/ArchiveChildButton";
import { InviteLinkResult } from "@/components/shared/InviteLinkResult";
import { Button } from "@/components/ui/Button";
import { FormMessage } from "@/components/ui/FormField";

export interface ReinviteChildRowProps {
  childId: string;
  childName: string;
}

export function ReinviteChildRow({ childId, childName }: ReinviteChildRowProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  function handleReinviteClick() {
    setError(null);
    setCopyMessage(null);

    startTransition(async () => {
      const result = await reinviteChild(childId);

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
    <div className="flex flex-col gap-3 rounded-lg border border-border p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="font-medium">{childName}</p>
        <div className="flex items-center gap-2">
          <ArchiveChildButton childId={childId} childName={childName} />
          <Button
            variant="secondary"
            size="sm"
            onClick={handleReinviteClick}
            disabled={isPending}
          >
            {isPending ? "Generating…" : "Reinvite"}
          </Button>
        </div>
      </div>
      {error ? <FormMessage variant="error">{error}</FormMessage> : null}
      {inviteUrl ? (
        <InviteLinkResult
          inviteUrl={inviteUrl}
          expiresAt={expiresAt}
          onCopy={handleCopyClick}
          copyMessage={copyMessage}
          linkLabel="Recovery link"
        />
      ) : null}
    </div>
  );
}
