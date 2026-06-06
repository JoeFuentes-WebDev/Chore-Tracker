-- V2-M7: Recovery invitations linked to existing child User

ALTER TABLE "Invitation" ADD COLUMN "userId" TEXT;

CREATE INDEX "Invitation_userId_idx" ON "Invitation"("userId");

ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
