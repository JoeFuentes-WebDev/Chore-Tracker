-- V2-M1: Family / User / Membership / Invitation + family scoping
-- Dual-column transition: childId + assignedUserId (TD-V2-07)
-- Child table retained for rollback (TD-V2-06)

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PARENT', 'CHILD');

-- AlterTable: Family — add name, remove legacy auth fields after backfill
ALTER TABLE "Family" ADD COLUMN "name" TEXT;

UPDATE "Family" SET "name" = 'Default Family' WHERE "name" IS NULL;

ALTER TABLE "Family" ALTER COLUMN "name" SET NOT NULL;

-- CreateTable: User
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "pinHash" TEXT,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable: FamilyMembership
CREATE TABLE "FamilyMembership" (
    "id" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FamilyMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Invitation
CREATE TABLE "Invitation" (
    "id" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- Backfill User from Child (preserve ids — TD-V2-02)
INSERT INTO "User" ("id", "slug", "name", "email", "phone", "pinHash", "role", "createdAt", "updatedAt")
SELECT
    c."id",
    LOWER(REGEXP_REPLACE(TRIM(c."name"), '[^a-zA-Z0-9]+', '-', 'g')),
    c."name",
    NULL,
    NULL,
    NULL,
    'CHILD'::"UserRole",
    c."createdAt",
    c."updatedAt"
FROM "Child" c;

-- Placeholder parent user (TD-V2-01)
INSERT INTO "User" ("id", "slug", "name", "email", "phone", "pinHash", "role", "createdAt", "updatedAt")
SELECT
    'v2m1-placeholder-parent',
    'parent',
    'Parent',
    NULL,
    f."parentPhone",
    f."pinHash",
    'PARENT'::"UserRole",
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "Family" f
WHERE f."id" = 'singleton'
  AND NOT EXISTS (SELECT 1 FROM "User" WHERE "slug" = 'parent');

-- FamilyMembership for all users → singleton family (or each child's family)
INSERT INTO "FamilyMembership" ("id", "familyId", "userId", "createdAt")
SELECT
    'fm-' || u."id",
    COALESCE(
        (SELECT c."familyId" FROM "Child" c WHERE c."id" = u."id" LIMIT 1),
        'singleton'
    ),
    u."id",
    CURRENT_TIMESTAMP
FROM "User" u
WHERE NOT EXISTS (SELECT 1 FROM "FamilyMembership" fm WHERE fm."userId" = u."id");

-- AlterTable: Chore — family scoping + User assignee
ALTER TABLE "Chore" ADD COLUMN "familyId" TEXT;
ALTER TABLE "Chore" ADD COLUMN "assignedUserId" TEXT;

UPDATE "Chore" ch
SET "familyId" = c."familyId"
FROM "Child" c
WHERE ch."childId" = c."id"
  AND ch."familyId" IS NULL;

UPDATE "Chore" SET "familyId" = 'singleton' WHERE "familyId" IS NULL;

UPDATE "Chore" SET "assignedUserId" = "childId" WHERE "childId" IS NOT NULL;

ALTER TABLE "Chore" ALTER COLUMN "familyId" SET NOT NULL;

-- AlterTable: Proposal — family scoping + User author
ALTER TABLE "Proposal" ADD COLUMN "familyId" TEXT;
ALTER TABLE "Proposal" ADD COLUMN "proposedByUserId" TEXT;

UPDATE "Proposal" p
SET "familyId" = c."familyId",
    "proposedByUserId" = p."childId"
FROM "Child" c
WHERE p."childId" = c."id";

ALTER TABLE "Proposal" ALTER COLUMN "familyId" SET NOT NULL;
ALTER TABLE "Proposal" ALTER COLUMN "proposedByUserId" SET NOT NULL;

-- Drop legacy Family auth columns (migrated to User)
ALTER TABLE "Family" DROP COLUMN "parentPhone",
DROP COLUMN "pinHash";

-- Remove singleton default so new families use cuid()
ALTER TABLE "Family" ALTER COLUMN "id" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "User_slug_key" ON "User"("slug");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "FamilyMembership_userId_key" ON "FamilyMembership"("userId");
CREATE INDEX "FamilyMembership_familyId_idx" ON "FamilyMembership"("familyId");
CREATE UNIQUE INDEX "Invitation_token_key" ON "Invitation"("token");
CREATE INDEX "Invitation_familyId_idx" ON "Invitation"("familyId");
CREATE INDEX "Chore_familyId_idx" ON "Chore"("familyId");
CREATE INDEX "Chore_assignedUserId_idx" ON "Chore"("assignedUserId");
CREATE INDEX "Proposal_familyId_idx" ON "Proposal"("familyId");
CREATE INDEX "Proposal_proposedByUserId_idx" ON "Proposal"("proposedByUserId");

-- AddForeignKey
ALTER TABLE "FamilyMembership" ADD CONSTRAINT "FamilyMembership_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FamilyMembership" ADD CONSTRAINT "FamilyMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Chore" ADD CONSTRAINT "Chore_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Chore" ADD CONSTRAINT "Chore_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_proposedByUserId_fkey" FOREIGN KEY ("proposedByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
