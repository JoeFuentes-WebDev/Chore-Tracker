"use client";

import { useState, useTransition, type MouseEvent } from "react";

import { archiveChildMember } from "@/app/(parent)/parent/actions";
import { Button } from "@/components/ui/Button";
import { FormMessage } from "@/components/ui/FormField";

export interface ArchiveChildButtonProps {
  childId: string;
  childName: string;
}

export function ArchiveChildButton({ childId, childName }: ArchiveChildButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleOpenConfirm() {
    setError(null);
    setShowConfirm(true);
  }

  function handleCloseConfirm() {
    if (!isPending) {
      setShowConfirm(false);
    }
  }

  function handleConfirmArchive() {
    setError(null);

    startTransition(async () => {
      const result = await archiveChildMember(childId);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setShowConfirm(false);
    });
  }

  function handleDialogClick(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
  }

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={handleOpenConfirm}
        disabled={isPending}
      >
        Archive
      </Button>
      {error && !showConfirm ? <FormMessage variant="error">{error}</FormMessage> : null}
      {showConfirm ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
          role="presentation"
          onClick={handleCloseConfirm}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`archive-child-${childId}`}
            className="w-full max-w-sm rounded-xl border border-border bg-background p-4 shadow-lg"
            onClick={handleDialogClick}
          >
            <h3 id={`archive-child-${childId}`} className="text-lg font-semibold">
              Archive {childName}?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {childName} will no longer appear in active workflows or receive
              notifications. History is preserved.
            </p>
            {error ? (
              <p className="mt-2 text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            <div className="mt-4 flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={handleCloseConfirm}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleConfirmArchive}
                disabled={isPending}
              >
                {isPending ? "Archiving…" : "Archive"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
