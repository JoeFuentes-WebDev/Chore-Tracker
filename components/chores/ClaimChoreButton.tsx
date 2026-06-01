"use client";

import { useState, useTransition } from "react";

import { claimChore } from "@/app/(kid)/board/actions";
import { cn } from "@/lib/utils";

export interface ClaimChoreButtonProps {
  choreId: string;
}

export function ClaimChoreButton({ choreId }: ClaimChoreButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClaim() {
    setError(null);
    startTransition(async () => {
      const result = await claimChore(choreId);
      if (!result.ok) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="mt-3 flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClaim}
        disabled={isPending}
        className={cn(
          "min-h-11 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
          "disabled:opacity-50",
        )}
      >
        {isPending ? "Claiming…" : "Claim"}
      </button>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
