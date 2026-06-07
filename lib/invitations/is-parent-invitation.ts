import { UserRole, type Invitation } from "@prisma/client";

/** True when invitation onboards a new parent (not recovery). */
export function isParentInvitation(
  invitation: Pick<Invitation, "role" | "userId">,
): boolean {
  return invitation.role === UserRole.PARENT && invitation.userId === null;
}
