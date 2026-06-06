/** Clerk sign-in route (App Router). */
export function getParentSignInPath(): string {
  return "/sign-in";
}

/** Clerk sign-up route (App Router). */
export function getParentSignUpPath(): string {
  return "/sign-up";
}

/** Post-auth redirect handler — centralizes M2 → M6 route migration. */
export function getParentPostAuthHandlerPath(): string {
  return "/auth/parent/continue";
}

/**
 * Destination after parent authentication.
 * M2: temporary flat /dashboard.
 * M6: return `/parent/${user.slug}` (or `/parent/${user.slug}/dashboard`).
 */
export function getParentPostAuthPath(user: { slug: string }): string {
  void user;
  return "/dashboard";
}

/** Where Clerk sends the user after sign-out. */
export function getParentSignOutRedirectPath(): string {
  return "/";
}
