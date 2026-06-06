"use client";

import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs";

import { Button } from "@/components/ui/Button";
import {
  getParentPostAuthHandlerPath,
  getParentSignOutRedirectPath,
} from "@/lib/auth/parent-auth-paths";

export function ParentAuthHeader() {
  const { user } = useUser();

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 px-3 py-2">
      <SignedOut>
        <p className="text-sm text-muted-foreground">Sign in to manage your family</p>
        <SignInButton mode="redirect" forceRedirectUrl={getParentPostAuthHandlerPath()}>
          <Button variant="primary" size="sm">
            Sign in
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <p className="min-w-0 truncate text-sm">
          Signed in as{" "}
          <span className="font-medium">{user?.fullName ?? user?.primaryEmailAddress?.emailAddress}</span>
        </p>
        <SignOutButton redirectUrl={getParentSignOutRedirectPath()}>
          <Button variant="secondary" size="sm">
            Sign out
          </Button>
        </SignOutButton>
      </SignedIn>
    </div>
  );
}
