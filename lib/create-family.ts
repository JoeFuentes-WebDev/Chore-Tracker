import { prisma } from "@/lib/prisma";

export interface CreateFamilyInput {
  name: string;
}

export type CreateFamilyResult =
  | { ok: true; familyId: string }
  | { ok: false; error: string };

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 50;

function validateFamilyName(name: string): string | null {
  const trimmed = name.trim();

  if (!trimmed) {
    return "Family name is required.";
  }

  if (trimmed.length < MIN_NAME_LENGTH) {
    return `Family name must be at least ${MIN_NAME_LENGTH} characters.`;
  }

  if (trimmed.length > MAX_NAME_LENGTH) {
    return `Family name must be ${MAX_NAME_LENGTH} characters or fewer.`;
  }

  return null;
}

/** Create a family and membership for a parent user (one family per user). */
export async function createFamilyForUser(
  userId: string,
  input: CreateFamilyInput,
): Promise<CreateFamilyResult> {
  const validationError = validateFamilyName(input.name);
  if (validationError) {
    return { ok: false, error: validationError };
  }

  const existingMembership = await prisma.familyMembership.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (existingMembership) {
    return { ok: false, error: "You already belong to a family." };
  }

  const trimmedName = input.name.trim();

  try {
    const family = await prisma.$transaction(async (tx) => {
      const createdFamily = await tx.family.create({
        data: { name: trimmedName },
      });

      await tx.familyMembership.create({
        data: {
          familyId: createdFamily.id,
          userId,
        },
      });

      return createdFamily;
    });

    return { ok: true, familyId: family.id };
  } catch {
    return { ok: false, error: "Could not create family. Please try again." };
  }
}
