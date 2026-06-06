import { redirect } from "next/navigation";

import { getClerkParentUser } from "@/lib/auth/get-clerk-parent-user";
import {
  getParentPostAuthPath,
  getParentSignInPath,
} from "@/lib/auth/parent-auth-paths";
import { logRuntimeDbContext } from "@/lib/diagnostics/log-runtime-db-context";

/** Central post-Clerk-auth redirect. Update getParentPostAuthPath for M6. */
export async function GET() {
  await logRuntimeDbContext("/auth/parent/continue");

  const parentUser = await getClerkParentUser();

  if (!parentUser) {
    redirect(getParentSignInPath());
  }

  redirect(getParentPostAuthPath(parentUser));
}
