-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- AlterTable
ALTER TABLE "FamilyMembership" ADD COLUMN "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE "FamilyMembership" ADD COLUMN "archivedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "FamilyMembership_familyId_status_idx" ON "FamilyMembership"("familyId", "status");
