"use client";

import { Button } from "@/components/ui/Button";
import { FormMessage } from "@/components/ui/FormField";

export interface InviteLinkResultProps {
  inviteUrl: string;
  expiresAt: string | null;
  onCopy: () => void;
  copyMessage: string | null;
  linkLabel?: string;
}

function formatExpiryDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function InviteLinkResult({
  inviteUrl,
  expiresAt,
  onCopy,
  copyMessage,
  linkLabel = "Invite link",
}: InviteLinkResultProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-3">
      <p className="text-xs font-medium text-muted-foreground">{linkLabel}</p>
      <p className="break-all text-sm">{inviteUrl}</p>
      {expiresAt ? (
        <p className="text-xs text-muted-foreground">
          Expires {formatExpiryDate(expiresAt)}
        </p>
      ) : null}
      <Button variant="primary" size="sm" className="w-full" onClick={onCopy}>
        Copy link
      </Button>
      {copyMessage ? <FormMessage variant="success">{copyMessage}</FormMessage> : null}
    </div>
  );
}
