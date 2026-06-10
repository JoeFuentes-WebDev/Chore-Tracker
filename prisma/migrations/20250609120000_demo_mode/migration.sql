-- Demo mode: flag families that are reset nightly by cron.
ALTER TABLE "Family" ADD COLUMN "isDemo" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "Family_isDemo_idx" ON "Family"("isDemo");
