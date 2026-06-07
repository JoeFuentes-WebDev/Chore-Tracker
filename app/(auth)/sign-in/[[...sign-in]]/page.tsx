import { SignIn } from "@clerk/nextjs";

import { AuthScreenLayout } from "@/components/layout/AuthScreenLayout";
import { getParentPostAuthHandlerPath } from "@/lib/auth/parent-auth-paths";

interface SignInPageProps {
  searchParams: Promise<{ redirect_url?: string }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { redirect_url: redirectUrl } = await searchParams;
  const postAuthPath = redirectUrl ?? getParentPostAuthHandlerPath();

  return (
    <AuthScreenLayout title="Parent sign in">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        fallbackRedirectUrl={postAuthPath}
        signUpFallbackRedirectUrl={postAuthPath}
      />
    </AuthScreenLayout>
  );
}
