"use client";

import { useState, useTransition, type ChangeEvent, type FormEvent } from "react";

import { createProposal } from "@/app/(kid)/board/actions";
import { Button } from "@/components/ui/Button";
import {
  FormField,
  FormMessage,
  FormSection,
  formInputClassName,
} from "@/components/ui/FormField";

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
    <FormSection title="Propose a chore" ariaLabel="Propose a chore">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField id="proposal-name" label="Name">
          <input
            id="proposal-name"
            type="text"
            required
            value={name}
            onChange={handleNameChange}
            className={formInputClassName}
            disabled={isPending}
          />
        </FormField>
        <FormField id="proposal-reward" label="Requested reward (USD)">
          <input
            id="proposal-reward"
            type="number"
            required
            min="0.01"
            step="0.01"
            value={askingReward}
            onChange={handleRewardChange}
            className={formInputClassName}
            disabled={isPending}
          />
        </FormField>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? "Submitting…" : "Submit proposal"}
        </Button>
        {error ? <FormMessage variant="error">{error}</FormMessage> : null}
        {success ? (
          <FormMessage variant="success">
            Proposal submitted. Your parent will review it.
          </FormMessage>
        ) : null}
      </form>
    </FormSection>
  );
}
