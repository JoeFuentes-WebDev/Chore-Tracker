"use client";

import { useState, useTransition, type ChangeEvent, type FormEvent } from "react";

import { createProposal } from "@/app/(kid)/board/actions";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const inputClassName = cn(
  "min-h-11 w-full rounded-lg border border-border bg-background px-3 py-2",
  "text-sm text-foreground",
);

export function CreateProposalForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState("");
  const [askingReward, setAskingReward] = useState("");

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setName(event.currentTarget.value);
  }

  function handleRewardChange(event: ChangeEvent<HTMLInputElement>) {
    setAskingReward(event.currentTarget.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const parsedReward = Number.parseFloat(askingReward);
    startTransition(async () => {
      const result = await createProposal({
        name,
        askingReward: parsedReward,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setName("");
      setAskingReward("");
      setSuccess(true);
    });
  }

  return (
    <section aria-label="Propose a chore">
      <h2 className="mb-3 text-lg font-semibold">Propose a chore</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="proposal-name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="proposal-name"
            type="text"
            required
            value={name}
            onChange={handleNameChange}
            className={inputClassName}
            disabled={isPending}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="proposal-reward" className="text-sm font-medium">
            Requested reward (USD)
          </label>
          <input
            id="proposal-reward"
            type="number"
            required
            min="0.01"
            step="0.01"
            value={askingReward}
            onChange={handleRewardChange}
            className={inputClassName}
            disabled={isPending}
          />
        </div>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? "Submitting…" : "Submit proposal"}
        </Button>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="text-sm text-muted-foreground" role="status">
            Proposal submitted. Your parent will review it.
          </p>
        ) : null}
      </form>
    </section>
  );
}
