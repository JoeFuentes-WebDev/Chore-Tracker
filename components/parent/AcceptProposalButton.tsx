"use client";

import { useState, useTransition } from "react";

import { acceptProposal } from "@/app/(parent)/dashboard/actions";
import { cn } from "@/lib/utils";

export interface AcceptProposalButtonProps {
  proposalId: string;
}

export function AcceptProposalButton({ proposalId }: AcceptProposalButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleAccept() {
    setError(null);
    startTransition(async () => {
      const result = await acceptProposal(proposalId);
      if (!result.ok) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-1 flex-col gap-2">
      <button
        type="button"
        onClick={handleAccept}
        disabled={isPending}
        className={cn(
          "min-h-11 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
          "disabled:opacity-50",
        )}
      >
        {isPending ? "Accepting…" : "Accept"}
      </button>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
