import { UserRole } from "@prisma/client";
import { randomUUID } from "crypto";

import { prisma } from "@/lib/prisma";

const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type CreateInvitationResult =
  | { ok: true; token: string; expiresAt: Date }
  | { ok: false; error: string };

/** Create a single-use child invitation for a family. */
export async function createChildInvitation(
  familyId: string,
): Promise<CreateInvitationResult> {
  const family = await prisma.family.findUnique({
    where: { id: familyId },
    select: { id: true },
  });

  if (!family) {
    return { ok: false, error: "Family not found." };
  }

  const expiresAt = new Date(Date.now() + INVITE_TTL_MS);

  const invitation = await prisma.invitation.create({
    data: {
      familyId,
      userId: null,
      token: randomUUID(),
      role: UserRole.CHILD,
      expiresAt,
    },
  });

  return {
    ok: true,
    token: invitation.token,
    expiresAt: invitation.expiresAt,
  };
}
