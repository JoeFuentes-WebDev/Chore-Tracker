/** Clerk sign-in route (App Router). */
export function getParentSignInPath(): string {
  return "/sign-in";
}

/** Clerk sign-up route (App Router). */
export function getParentSignUpPath(): string {
  return "/sign-up";
}

/** Post-auth redirect handler — centralizes post-Clerk routing. */
export function getParentPostAuthHandlerPath(): string {
  return "/auth/parent/continue";
}

/** Canonical parent dashboard URL. Slug is presentation only. */
export function getParentDashboardPath(user: { slug: string }): string {
  return `/parent/${user.slug}`;
}

/** Destination after parent authentication. */
export function getParentPostAuthPath(user: { slug: string }): string {
  return getParentDashboardPath(user);
}

/** Where Clerk sends the user after sign-out. */
export function getParentSignOutRedirectPath(): string {
  return "/";
}

/** Legacy flat dashboard route — redirects to canonical parent URL. */
export function getLegacyParentDashboardPath(): string {
  return "/dashboard";
}
