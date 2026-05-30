"use client";

import type { Chore } from "@/lib/types";

export interface EditChoreSheetProps {
  chore: Chore;
  /** Called when the sheet should close (cancel or after a successful save). */
  onClose: () => void;
  /** Called after a successful update (PATCH /api/chores/[id]). */
  onSaved?: (chore: Chore) => void;
}

// shadcn: Sheet (slides up from bottom on mobile). Same fields as AddChoreForm,
// pre-populated from `chore`.
export function EditChoreSheet(_props: EditChoreSheetProps) {
  // TODO: pre-populate fields, submit to PATCH /api/chores/[id], inline errors.
  return null;
}
