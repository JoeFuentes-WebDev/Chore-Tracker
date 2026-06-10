"use client";

import { useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { updateParentPhone } from "@/app/(parent)/parent/actions";
import { Button } from "@/components/ui/Button";
import { CardSection } from "@/components/ui/Card";
import {
  FormField,
  FormMessage,
  formInputClassName,
} from "@/components/ui/FormField";

export interface SettingsFormProps {
  initialPhone: string | null;
}

export function SettingsForm({ initialPhone }: SettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [phone, setPhone] = useState(initialPhone ?? "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handlePhoneChange(event: ChangeEvent<HTMLInputElement>) {
    setPhone(event.currentTarget.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await updateParentPhone(phone);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setSuccess(true);
      router.refresh();
    });
  }

  return (
    <CardSection aria-label="Notification settings">
      <p className="text-lg font-medium">SMS notifications</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Your phone number for chore and proposal text alerts.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <FormField id="parent-phone" label="Phone number">
          <input
            id="parent-phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={handlePhoneChange}
            className={formInputClassName}
            disabled={isPending}
            placeholder="+1 415 555 1234"
          />
        </FormField>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? "Saving…" : "Save phone number"}
        </Button>
        {error ? <FormMessage variant="error">{error}</FormMessage> : null}
        {success ? (
          <FormMessage variant="success">Phone number saved.</FormMessage>
        ) : null}
      </form>
    </CardSection>
  );
}
