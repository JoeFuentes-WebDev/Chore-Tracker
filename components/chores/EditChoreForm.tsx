"use client";

import { useState, useTransition, type ChangeEvent, type FormEvent } from "react";

import { updateChore } from "@/app/(parent)/parent/actions";
import { Button } from "@/components/ui/Button";
import {
  FormField,
  FormMessage,
  formInputClassName,
} from "@/components/ui/FormField";
import type { FamilyChoreLibraryItem } from "@/lib/family-chore-library-types";
import { cn } from "@/lib/utils";

export interface EditChoreFormProps {
  chore: FamilyChoreLibraryItem;
  onCancel: () => void;
  onSaved: () => void;
}

export function EditChoreForm({ chore, onCancel, onSaved }: EditChoreFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState(chore.name);
  const [description, setDescription] = useState(chore.description ?? "");
  const [reward, setReward] = useState(String(chore.reward));

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setName(event.currentTarget.value);
  }

  function handleDescriptionChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setDescription(event.currentTarget.value);
  }

  function handleRewardChange(event: ChangeEvent<HTMLInputElement>) {
    setReward(event.currentTarget.value);
  }

  function handleCancelClick() {
    onCancel();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsedReward = Number.parseFloat(reward);
    startTransition(async () => {
      const result = await updateChore({
        choreId: chore.id,
        name,
        description: description.length > 0 ? description : undefined,
        reward: parsedReward,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      onSaved();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3 border-t border-border pt-3">
      <FormField id={`edit-name-${chore.id}`} label="Name">
        <input
          id={`edit-name-${chore.id}`}
          type="text"
          required
          value={name}
          onChange={handleNameChange}
          className={formInputClassName}
          disabled={isPending}
        />
      </FormField>
      <FormField id={`edit-description-${chore.id}`} label="Description" optionalHint>
        <textarea
          id={`edit-description-${chore.id}`}
          value={description}
          onChange={handleDescriptionChange}
          className={cn(formInputClassName, "min-h-16 resize-none")}
          disabled={isPending}
        />
      </FormField>
      <FormField id={`edit-reward-${chore.id}`} label="Reward (USD)">
        <input
          id={`edit-reward-${chore.id}`}
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
      <div className="flex flex-col gap-2">
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? "Saving…" : "Save changes"}
        </Button>
        <Button type="button" variant="secondary" disabled={isPending} onClick={handleCancelClick}>
          Cancel
        </Button>
      </div>
      {error ? <FormMessage variant="error">{error}</FormMessage> : null}
    </form>
  );
}
