import {
  ChoreCreator,
  ChoreStatus,
  ProposalStatus,
  UserRole,
} from "@prisma/client";

import { generateUniqueUserSlug } from "@/lib/auth/generate-user-slug";
import { prisma } from "@/lib/prisma";

export interface SeedDemoFamilyResult {
  familyId: string;
}

/** Create an isolated demo family with preset parent, child, chores, and proposal. */
export async function seedDemoFamily(): Promise<SeedDemoFamilyResult> {
  const parentSlug = await generateUniqueUserSlug("Demo Parent", null);
  const childSlug = await generateUniqueUserSlug("Demo Child", null);

  const family = await prisma.$transaction(async (tx) => {
    const createdFamily = await tx.family.create({
      data: {
        name: "Demo Family",
        isDemo: true,
      },
    });

    const parentUser = await tx.user.create({
      data: {
        slug: parentSlug,
        name: "Demo Parent",
        role: UserRole.PARENT,
      },
    });

    const childUser = await tx.user.create({
      data: {
        slug: childSlug,
        name: "Demo Child",
        role: UserRole.CHILD,
      },
    });

    await tx.familyMembership.createMany({
      data: [
        { familyId: createdFamily.id, userId: parentUser.id },
        { familyId: createdFamily.id, userId: childUser.id },
      ],
    });

    await tx.child.create({
      data: {
        id: childUser.id,
        name: childUser.name,
        familyId: createdFamily.id,
      },
    });

    await tx.chore.createMany({
      data: [
        {
          name: "Make bed",
          description: "Straighten sheets and fluff pillows",
          reward: 1.0,
          status: ChoreStatus.AVAILABLE,
          familyId: createdFamily.id,
          createdBy: ChoreCreator.PARENT,
        },
        {
          name: "Feed the dog",
          description: "Morning and evening portions",
          reward: 2.5,
          status: ChoreStatus.AVAILABLE,
          familyId: createdFamily.id,
          createdBy: ChoreCreator.PARENT,
        },
        {
          name: "Vacuum living room",
          reward: 3.0,
          status: ChoreStatus.CLAIMED,
          familyId: createdFamily.id,
          childId: childUser.id,
          assignedUserId: childUser.id,
          createdBy: ChoreCreator.PARENT,
        },
        {
          name: "Unload dishwasher",
          reward: 2.0,
          status: ChoreStatus.PENDING_APPROVAL,
          familyId: createdFamily.id,
          childId: childUser.id,
          assignedUserId: childUser.id,
          createdBy: ChoreCreator.PARENT,
        },
        {
          name: "Wash the car",
          reward: 5.0,
          status: ChoreStatus.APPROVED,
          paid: false,
          familyId: createdFamily.id,
          childId: childUser.id,
          assignedUserId: childUser.id,
          createdBy: ChoreCreator.PARENT,
        },
      ],
    });

    await tx.proposal.create({
      data: {
        name: "Organize garage shelves",
        askingReward: 8.0,
        status: ProposalStatus.PENDING,
        familyId: createdFamily.id,
        childId: childUser.id,
        proposedByUserId: childUser.id,
      },
    });

    return createdFamily;
  });

  return { familyId: family.id };
}
