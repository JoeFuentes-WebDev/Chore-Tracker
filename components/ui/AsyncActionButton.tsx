"use client";

import { useState, useTransition } from "react";

import { Button, type ButtonProps } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export type AsyncActionResult =
  | { ok: true }
  | { ok: false; error: string };

export interface AsyncActionButtonProps {
  action: () => Promise<AsyncActionResult>;
  idleLabel: string;
  pendingLabel: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
  buttonClassName?: string;
  onSuccess?: () => void;
}

export function AsyncActionButton({
  action,
  idleLabel,
  pendingLabel,
  variant = "primary",
  size = "md",
  className,
  buttonClassName,
  onSuccess,
}: AsyncActionButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        setError(result.error);
        return;
      }

      onSuccess?.();
    });
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Button
        variant={variant}
        size={size}
        className={buttonClassName}
        onClick={handleClick}
        disabled={isPending}
      >
        {isPending ? pendingLabel : idleLabel}
      </Button>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
