import { SignIn } from "@clerk/nextjs";

import { AuthScreenLayout } from "@/components/layout/AuthScreenLayout";

export default function SignInPage() {
  return (
    <AuthScreenLayout title="Parent sign in">
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
    </AuthScreenLayout>
  );
}
