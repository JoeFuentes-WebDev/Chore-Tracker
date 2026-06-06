import { redirect } from "next/navigation";

import { getClerkParentUser } from "@/lib/auth/get-clerk-parent-user";
import {
  getParentPostAuthPath,
  getParentSignInPath,
} from "@/lib/auth/parent-auth-paths";

/** Central post-Clerk-auth redirect. Update getParentPostAuthPath for M6. */
export async function GET() {
  const parentUser = await getClerkParentUser();

  if (!parentUser) {
    redirect(getParentSignInPath());
  }

  redirect(getParentPostAuthPath(parentUser));
}
