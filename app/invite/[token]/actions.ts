"use server";

import { redirect } from "next/navigation";

import {
  acceptInvitationByToken,
  type AcceptInvitationInput,
} from "@/lib/accept-invitation";
import { setChildSessionUserId } from "@/lib/auth/child-session";
import { getChildBoardPath } from "@/lib/auth/child-auth-paths";

export async function acceptInvitation(
  input: AcceptInvitationInput,
): Promise<{ ok: false; error: string } | never> {
  const result = await acceptInvitationByToken(input);

  if (!result.ok) {
    return result;
  }

  await setChildSessionUserId(result.userId);
  redirect(getChildBoardPath());
}
