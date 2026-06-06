import { UserRole } from "@prisma/client";

import { generateUniqueUserSlug } from "@/lib/auth/generate-user-slug";
import { hashPin, isValidPin } from "@/lib/auth/hash-pin";
import { isRecoveryInvitation } from "@/lib/invitations/is-recovery-invitation";
import { validateInvitationForAccept } from "@/lib/invitations/validate-invitation";
import { prisma } from "@/lib/prisma";

export interface AcceptInvitationInput {
  token: string;
  name: string;
  pin: string;
  confirmPin: string;
}

export type AcceptInvitationResult =
  | { ok: true; userId: string; slug: string }
  | { ok: false; error: string };

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 50;

function validateChildName(name: string): string | null {
  const trimmed = name.trim();

  if (!trimmed) {
    return "Name is required.";
  }

  if (trimmed.length < MIN_NAME_LENGTH) {
    return `Name must be at least ${MIN_NAME_LENGTH} characters.`;
  }

  if (trimmed.length > MAX_NAME_LENGTH) {
    return `Name must be ${MAX_NAME_LENGTH} characters or fewer.`;
  }

  return null;
}

function validatePins(pin: string, confirmPin: string): string | null {
  if (!isValidPin(pin)) {
    return "PIN must be exactly 4 digits.";
  }

  if (pin !== confirmPin) {
    return "PINs do not match.";
  }

  return null;
}

/** Accept a child invitation — creates User, FamilyMembership, and legacy Child row. */
export async function acceptInvitationByToken(
  input: AcceptInvitationInput,
): Promise<AcceptInvitationResult> {
  const nameError = validateChildName(input.name);
  if (nameError) {
    return { ok: false, error: nameError };
  }

  const pinError = validatePins(input.pin, input.confirmPin);
  if (pinError) {
    return { ok: false, error: pinError };
  }

  const invitation = await prisma.invitation.findUnique({
    where: { token: input.token },
  });

  const invitationValidation = validateInvitationForAccept(invitation);
  if (!invitationValidation.ok) {
    return invitationValidation;
  }

  const { invitation: validInvitation } = invitationValidation;

  if (validInvitation.role !== UserRole.CHILD) {
    return { ok: false, error: "This invitation is invalid." };
  }

  if (isRecoveryInvitation(validInvitation)) {
    return {
      ok: false,
      error: "This link restores an existing account. Use Continue on the recovery page.",
    };
  }

  const trimmedName = input.name.trim();
  const pinHash = await hashPin(input.pin);
  const slug = await generateUniqueUserSlug(trimmedName, null);

  try {
    const userId = await prisma.$transaction(async (tx) => {
      const claimed = await tx.invitation.updateMany({
        where: {
          id: validInvitation.id,
          acceptedAt: null,
          expiresAt: { gt: new Date() },
        },
        data: { acceptedAt: new Date() },
      });

      if (claimed.count === 0) {
        throw new Error("INVITATION_ALREADY_USED");
      }

      const childUser = await tx.user.create({
        data: {
          name: trimmedName,
          slug,
          role: UserRole.CHILD,
          pinHash,
        },
      });

      await tx.familyMembership.create({
        data: {
          familyId: validInvitation.familyId,
          userId: childUser.id,
        },
      });

      await tx.child.create({
        data: {
          id: childUser.id,
          name: trimmedName,
          familyId: validInvitation.familyId,
        },
      });

      return childUser.id;
    });

    return { ok: true, userId, slug };
  } catch (error) {
    if (error instanceof Error && error.message === "INVITATION_ALREADY_USED") {
      return { ok: false, error: "This invitation has already been used." };
    }

    return { ok: false, error: "Could not join family. Please try again." };
  }
}
