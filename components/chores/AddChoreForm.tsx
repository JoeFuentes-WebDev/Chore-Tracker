"use client";

import type { Chore } from "@/lib/types";

export interface AddChoreFormProps {
  /** Called after a chore is successfully created (POST /api/chores). */
  onCreated?: (chore: Chore) => void;
}

// shadcn: Input, Label, Switch, Button. Fields: name, emoji picker (plain
// Tailwind grid), reward, recurring toggle.
export function AddChoreForm(_props: AddChoreFormProps) {
  // TODO: controlled form state, submit to POST /api/chores, inline error state.
  return null;
}
