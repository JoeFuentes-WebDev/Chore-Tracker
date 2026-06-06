"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type ChangeEvent, type FormEvent } from "react";

import { createFamily } from "@/app/(parent)/dashboard/actions";
import { Button } from "@/components/ui/Button";
import {
  FormField,
  FormMessage,
  FormSection,
  formInputClassName,
} from "@/components/ui/FormField";

export function CreateFamilyForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [familyName, setFamilyName] = useState("");

  function handleFamilyNameChange(event: ChangeEvent<HTMLInputElement>) {
    setFamilyName(event.currentTarget.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createFamily({ name: familyName });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.refresh();
    });
  }

  return (
    <FormSection title="Create your family" ariaLabel="Create family">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <FormField id="family-name" label="Family name">
          <input
            id="family-name"
            name="familyName"
            type="text"
            required
            minLength={2}
            maxLength={50}
            autoComplete="organization"
            className={formInputClassName}
            value={familyName}
            onChange={handleFamilyNameChange}
            disabled={isPending}
          />
        </FormField>
        {error ? <FormMessage variant="error">{error}</FormMessage> : null}
        <Button type="submit" variant="primary" className="w-full" disabled={isPending}>
          {isPending ? "Creating…" : "Create family"}
        </Button>
      </form>
    </FormSection>
  );
}
