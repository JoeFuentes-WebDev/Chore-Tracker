import { SignUp } from "@clerk/nextjs";

import { AuthScreenLayout } from "@/components/layout/AuthScreenLayout";

export default function SignUpPage() {
  return (
    <AuthScreenLayout title="Create parent account">
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
    </AuthScreenLayout>
  );
}
