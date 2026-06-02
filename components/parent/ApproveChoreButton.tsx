"use client";

import { useState, useTransition } from "react";

import { approveChore } from "@/app/(parent)/dashboard/actions";
import { cn } from "@/lib/utils";

export interface ApproveChoreButtonProps {
  choreId: string;
}

export function ApproveChoreButton({ choreId }: ApproveChoreButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleApprove() {
    setError(null);
    startTransition(async () => {
      const result = await approveChore(choreId);
      if (!result.ok) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="mt-3 flex flex-col gap-2">
      <button
        type="button"
        onClick={handleApprove}
        disabled={isPending}
        className={cn(
          "min-h-11 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
          "disabled:opacity-50",
        )}
      >
        {isPending ? "Approving…" : "Approve"}
      </button>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
