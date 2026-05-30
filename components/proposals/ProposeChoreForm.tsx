"use client";

import type { Proposal } from "@/lib/types";

export interface ProposeChoreFormProps {
  /** Called after a proposal is successfully submitted (POST /api/proposals). */
  onSubmitted?: (proposal: Proposal) => void;
}

// shadcn: Input, Label, Button + plain Tailwind emoji picker grid.
// Fields: chore name, emoji picker, suggested reward (number).
export function ProposeChoreForm(_props: ProposeChoreFormProps) {
  // TODO: controlled form state, submit to POST /api/proposals, inline errors.
  return null;
}
