"use client";

import { useState, useTransition, type ChangeEvent, type FormEvent } from "react";

import { createChore } from "@/app/(parent)/dashboard/actions";
import { Button } from "@/components/ui/Button";
import {
  FormField,
  FormMessage,
  FormSection,
  formInputClassName,
} from "@/components/ui/FormField";
import { cn } from "@/lib/utils";

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
    <FormSection title="Create a chore" ariaLabel="Create chore">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField id="chore-name" label="Name">
          <input
            id="chore-name"
            type="text"
            required
            value={name}
            onChange={handleNameChange}
            className={formInputClassName}
            disabled={isPending}
          />
        </FormField>
        <FormField id="chore-description" label="Description" optionalHint>
          <textarea
            id="chore-description"
            value={description}
            onChange={handleDescriptionChange}
            className={cn(formInputClassName, "min-h-20 resize-none")}
            disabled={isPending}
          />
        </FormField>
        <FormField id="chore-reward" label="Reward (USD)">
          <input
            id="chore-reward"
            type="number"
            required
            min="0.01"
            step="0.01"
            value={reward}
            onChange={handleRewardChange}
            className={formInputClassName}
            disabled={isPending}
          />
        </FormField>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? "Creating…" : "Create chore"}
        </Button>
        {error ? <FormMessage variant="error">{error}</FormMessage> : null}
        {success ? (
          <FormMessage variant="success">
            Chore created. It is now available on the child board.
          </FormMessage>
        ) : null}
      </form>
    </FormSection>
  );
}
