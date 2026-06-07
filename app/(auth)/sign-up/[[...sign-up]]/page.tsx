import { SignUp } from "@clerk/nextjs";

import { AuthScreenLayout } from "@/components/layout/AuthScreenLayout";
import { getParentPostAuthHandlerPath } from "@/lib/auth/parent-auth-paths";

interface SignUpPageProps {
  searchParams: Promise<{ redirect_url?: string }>;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const { redirect_url: redirectUrl } = await searchParams;
  const postAuthPath = redirectUrl ?? getParentPostAuthHandlerPath();

  return (
    <AuthScreenLayout title="Create parent account">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl={postAuthPath}
        signInFallbackRedirectUrl={postAuthPath}
      />
    </AuthScreenLayout>
  );
}
