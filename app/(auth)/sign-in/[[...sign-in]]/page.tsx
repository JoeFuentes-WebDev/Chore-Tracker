import { SignIn } from "@clerk/nextjs";

import { AuthScreenLayout } from "@/components/layout/AuthScreenLayout";
import { getParentPostAuthHandlerPath } from "@/lib/auth/parent-auth-paths";

export default function SignInPage() {
  const postAuthPath = getParentPostAuthHandlerPath();

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
