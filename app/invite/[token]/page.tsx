import { JoinFamilyForm } from "@/components/child/JoinFamilyForm";
import { RestoreAccessForm } from "@/components/child/RestoreAccessForm";
import { JoinFamilyLayout } from "@/components/layout/JoinFamilyLayout";
import { CardSection } from "@/components/ui/Card";
import { isRecoveryInvitation } from "@/lib/invitations/is-recovery-invitation";
import { validateInvitationForAccept } from "@/lib/invitations/validate-invitation";
import { validateRecoveryInvitationForAccept } from "@/lib/invitations/validate-recovery-invitation";
import { prisma } from "@/lib/prisma";

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
