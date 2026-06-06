import { JoinFamilyForm } from "@/components/child/JoinFamilyForm";
import { JoinFamilyLayout } from "@/components/layout/JoinFamilyLayout";
import { CardSection } from "@/components/ui/Card";
import { validateInvitationForAccept } from "@/lib/invitations/validate-invitation";
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

  return (
    <JoinFamilyLayout title="Join family">
      <JoinFamilyForm token={token} />
    </JoinFamilyLayout>
  );
}
