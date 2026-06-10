import { prisma } from "@/lib/prisma";

export interface UpdateParentPhoneInput {
  userId: string;
  phone: string | null;
}

export type UpdateParentPhoneResult = { ok: true } | { ok: false; error: string };

function normalizePhone(phone: string): string | null {
  const trimmed = phone.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function validatePhone(phone: string | null): string | null {
  if (phone === null) {
    return null;
  }

  if (phone.length < 10) {
    return "Enter a valid phone number.";
  }

  return null;
}

/** Persist SMS notification phone on the parent User record. */
export async function updateParentPhone(
  input: UpdateParentPhoneInput,
): Promise<UpdateParentPhoneResult> {
  const phone = normalizePhone(input.phone ?? "");
  const validationError = validatePhone(phone);

  if (validationError) {
    return { ok: false, error: validationError };
  }

  await prisma.user.update({
    where: { id: input.userId },
    data: { phone },
  });

  return { ok: true };
}
