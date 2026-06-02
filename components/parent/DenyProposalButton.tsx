"use client";

import { useState, useTransition } from "react";

import { denyProposal } from "@/app/(parent)/dashboard/actions";
import { cn } from "@/lib/utils";

export interface DenyProposalButtonProps {
  proposalId: string;
}

export function DenyProposalButton({ proposalId }: DenyProposalButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDeny() {
    setError(null);
    startTransition(async () => {
      const result = await denyProposal(proposalId);
      if (!result.ok) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-1 flex-col gap-2">
      <button
        type="button"
        onClick={handleDeny}
        disabled={isPending}
        className={cn(
          "min-h-11 rounded-lg border border-border bg-background px-4 py-2",
          "text-sm font-medium text-foreground disabled:opacity-50",
        )}
      >
        {isPending ? "Denying…" : "Deny"}
      </button>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
