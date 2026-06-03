"use client";

import { useState, useTransition, type ChangeEvent, type FormEvent } from "react";

import { createChore } from "@/app/(parent)/dashboard/actions";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const inputClassName = cn(
  "min-h-11 w-full rounded-lg border border-border bg-background px-3 py-2",
  "text-sm text-foreground",
);

export function CreateChoreForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState("");

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setName(event.currentTarget.value);
  }

  function handleDescriptionChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setDescription(event.currentTarget.value);
  }

  function handleRewardChange(event: ChangeEvent<HTMLInputElement>) {
    setReward(event.currentTarget.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const parsedReward = Number.parseFloat(reward);
    startTransition(async () => {
      const result = await createChore({
        name,
        description: description.length > 0 ? description : undefined,
        reward: parsedReward,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setName("");
      setDescription("");
      setReward("");
      setSuccess(true);
    });
  }

  return (
    <section aria-label="Create chore">
      <h2 className="mb-3 text-lg font-semibold">Create a chore</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="chore-name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="chore-name"
            type="text"
            required
            value={name}
            onChange={handleNameChange}
            className={inputClassName}
            disabled={isPending}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="chore-description" className="text-sm font-medium">
            Description <span className="text-muted-foreground">(optional)</span>
          </label>
          <textarea
            id="chore-description"
            value={description}
            onChange={handleDescriptionChange}
            className={cn(inputClassName, "min-h-20 resize-none")}
            disabled={isPending}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="chore-reward" className="text-sm font-medium">
            Reward (USD)
          </label>
          <input
            id="chore-reward"
            type="number"
            required
            min="0.01"
            step="0.01"
            value={reward}
            onChange={handleRewardChange}
            className={inputClassName}
            disabled={isPending}
          />
        </div>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? "Creating…" : "Create chore"}
        </Button>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="text-sm text-muted-foreground" role="status">
            Chore created. It is now available on the child board.
          </p>
        ) : null}
      </form>
    </section>
  );
}
