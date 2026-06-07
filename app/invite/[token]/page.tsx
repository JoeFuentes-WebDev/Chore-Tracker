import Link from "next/link";

import { JoinFamilyForm } from "@/components/child/JoinFamilyForm";
import { RestoreAccessForm } from "@/components/child/RestoreAccessForm";
import { AcceptParentInviteForm } from "@/components/parent/AcceptParentInviteForm";
import { JoinFamilyLayout } from "@/components/layout/JoinFamilyLayout";
import { buttonVariants } from "@/components/ui/Button";
import { CardSection } from "@/components/ui/Card";
import { getClerkParentUser } from "@/lib/auth/get-clerk-parent-user";
import { getParentSignInPath } from "@/lib/auth/parent-auth-paths";
import { isParentInvitation } from "@/lib/invitations/is-parent-invitation";
import { isRecoveryInvitation } from "@/lib/invitations/is-recovery-invitation";
import { validateInvitationForAccept } from "@/lib/invitations/validate-invitation";
import { validateRecoveryInvitationForAccept } from "@/lib/invitations/validate-recovery-invitation";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  const invitation = await prisma.invitation.findUnique({
    where: { token },
  });

  const validation = validateInvitationForAccept(invitation);

  if (!validation.ok) {
    return (
      <JoinFamilyLayout title="Join family">
        <CardSection aria-label="Invitation error">
          <p className="text-lg font-medium">Unable to join</p>
          <p className="mt-2 text-sm text-muted-foreground">{validation.error}</p>
        </CardSection>
      </JoinFamilyLayout>
    );
  }

  if (isParentInvitation(validation.invitation)) {
    const parentUser = await getClerkParentUser();
    const invitePath = `/invite/${token}`;
    const signInPath = `${getParentSignInPath()}?redirect_url=${encodeURIComponent(invitePath)}`;

    return (
      <JoinFamilyLayout title="Join family">
        <CardSection aria-label="Parent invitation">
          <p className="text-lg font-medium">Join as a parent</p>
          {parentUser ? (
            <div className="mt-4">
              <AcceptParentInviteForm token={token} />
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">
                Sign in or create a parent account to accept this invitation.
              </p>
              <Link
                href={signInPath}
                className={cn(buttonVariants({ variant: "primary" }), "w-full")}
              >
                Sign in to continue
              </Link>
            </div>
          )}
        </CardSection>
      </JoinFamilyLayout>
    );
  }

  if (isRecoveryInvitation(validation.invitation)) {
    const recoveryValidation = await validateRecoveryInvitationForAccept(
      validation.invitation,
    );

    if (!recoveryValidation.ok) {
      return (
        <JoinFamilyLayout title="Restore access">
          <CardSection aria-label="Invitation error">
            <p className="text-lg font-medium">Unable to restore access</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {recoveryValidation.error}
            </p>
          </CardSection>
        </JoinFamilyLayout>
      );
    }

    return (
      <JoinFamilyLayout title="Restore access">
        <RestoreAccessForm token={token} childName={recoveryValidation.childName} />
      </JoinFamilyLayout>
    );
  }

  return (
    <JoinFamilyLayout title="Join family">
      <JoinFamilyForm token={token} />
    </JoinFamilyLayout>
  );
}
