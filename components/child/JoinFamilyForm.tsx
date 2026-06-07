"use client";

import { useState, useTransition, type ChangeEvent, type FormEvent } from "react";

import { acceptInvitation } from "@/app/invite/[token]/actions";
import { Button } from "@/components/ui/Button";
import {
  FormField,
  FormMessage,
  FormSection,
  formInputClassName,
} from "@/components/ui/FormField";

export interface JoinFamilyFormProps {
  token: string;
}

export function JoinFamilyForm({ token }: JoinFamilyFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setName(event.currentTarget.value);
  }

  function handlePinChange(event: ChangeEvent<HTMLInputElement>) {
    setPin(event.currentTarget.value);
  }

  function handleConfirmPinChange(event: ChangeEvent<HTMLInputElement>) {
    setConfirmPin(event.currentTarget.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await acceptInvitation({
        token,
        name,
        pin,
        confirmPin,
      });

      if (result?.ok === false) {
        setError(result.error);
      }
    });
  }

  return (
    <FormSection title="Your details" ariaLabel="Join family form">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <FormField id="child-name" label="Name">
          <input
            id="child-name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={50}
            autoComplete="name"
            className={formInputClassName}
            value={name}
            onChange={handleNameChange}
            disabled={isPending}
          />
        </FormField>
        <FormField id="child-pin" label="PIN (4 digits)">
          <input
            id="child-pin"
            name="pin"
            type="password"
            inputMode="numeric"
            pattern="\d{4}"
            maxLength={4}
            required
            autoComplete="new-password"
            className={formInputClassName}
            value={pin}
            onChange={handlePinChange}
            disabled={isPending}
          />
        </FormField>
        <FormField id="child-pin-confirm" label="Confirm PIN">
          <input
            id="child-pin-confirm"
            name="confirmPin"
            type="password"
            inputMode="numeric"
            pattern="\d{4}"
            maxLength={4}
            required
            autoComplete="new-password"
            className={formInputClassName}
            value={confirmPin}
            onChange={handleConfirmPinChange}
            disabled={isPending}
          />
        </FormField>
        {error ? <FormMessage variant="error">{error}</FormMessage> : null}
        <Button type="submit" variant="primary" className="w-full" disabled={isPending}>
          {isPending ? "Joining…" : "Join family"}
        </Button>
      </form>
    </FormSection>
  );
}
