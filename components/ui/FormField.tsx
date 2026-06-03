import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export const formInputClassName = cn(
  "min-h-11 w-full rounded-lg border border-border bg-background px-3 py-2",
  "text-sm text-foreground",
);

export interface FormFieldProps {
  id: string;
  label: string;
  optionalHint?: boolean;
  children: ReactNode;
}

export function FormField({ id, label, optionalHint = false, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {optionalHint ? (
          <span className="text-muted-foreground"> (optional)</span>
        ) : null}
      </label>
      {children}
    </div>
  );
}

export interface FormMessageProps {
  variant: "error" | "success";
  children: ReactNode;
}

export function FormMessage({ variant, children }: FormMessageProps) {
  if (variant === "error") {
    return (
      <p className="text-sm text-destructive" role="alert">
        {children}
      </p>
    );
  }

  return (
    <p className="text-sm text-muted-foreground" role="status">
      {children}
    </p>
  );
}

export interface FormSectionProps {
  title: string;
  ariaLabel: string;
  children: ReactNode;
}

export function FormSection({ title, ariaLabel, children }: FormSectionProps) {
  return (
    <section aria-label={ariaLabel}>
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}
