"use client";

import { useState, useTransition, type MouseEvent } from "react";

import { payBalance } from "@/app/(parent)/dashboard/actions";
import { cn, formatReward } from "@/lib/utils";

export interface PayBalanceButtonProps {
  balanceTotal: number;
  disabled: boolean;
}

export function PayBalanceButton({ balanceTotal, disabled }: PayBalanceButtonProps) {
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

  function handleConfirmPay() {
    setError(null);
    startTransition(async () => {
      const result = await payBalance();
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
      <button
        type="button"
        onClick={handleOpenConfirm}
        disabled={disabled || isPending}
        className={cn(
          "min-h-11 w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
          "disabled:opacity-50",
        )}
      >
        Pay balance
      </button>
      {error && !showConfirm ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {showConfirm ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
          role="presentation"
          onClick={handleCloseConfirm}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="pay-balance-title"
            className="w-full max-w-sm rounded-xl border border-border bg-background p-4 shadow-lg"
            onClick={handleDialogClick}
          >
            <h3 id="pay-balance-title" className="text-lg font-semibold">
              Pay {formatReward(balanceTotal)}?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              All approved chores will be marked as paid. This cannot be undone.
            </p>
            {error ? (
              <p className="mt-2 text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={handleCloseConfirm}
                disabled={isPending}
                className={cn(
                  "min-h-11 flex-1 rounded-lg border border-border bg-background px-4 py-2",
                  "text-sm font-medium text-foreground disabled:opacity-50",
                )}
              >
                No
              </button>
              <button
                type="button"
                onClick={handleConfirmPay}
                disabled={isPending}
                className={cn(
                  "min-h-11 flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium",
                  "text-primary-foreground disabled:opacity-50",
                )}
              >
                {isPending ? "Paying…" : "Yes, pay"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
