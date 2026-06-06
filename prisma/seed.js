const {
  PrismaClient,
  ChoreStatus,
  ChoreCreator,
  ProposalStatus,
  UserRole,
} = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

const DEMO_FAMILY_ID = "singleton";
const PARENT_USER_ID = "seed-parent-user";
const CHILD_USER_ID = "seed-child-user";

async function main() {
  await prisma.notificationLog.deleteMany();
  await prisma.chore.deleteMany();
  await prisma.proposal.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.familyMembership.deleteMany();
  await prisma.user.deleteMany();
  await prisma.child.deleteMany();
  await prisma.family.deleteMany();

  const family = await prisma.family.create({
    data: {
      id: DEMO_FAMILY_ID,
      name: "Demo Family",
    },
  });

  const parentUser = await prisma.user.create({
    data: {
      id: PARENT_USER_ID,
      slug: "parent",
      name: "Parent",
      phone: "+15555550100",
      role: UserRole.PARENT,
    },
  });

  const childUser = await prisma.user.create({
    data: {
      id: CHILD_USER_ID,
      slug: "alex",
      name: "Alex",
      role: UserRole.CHILD,
    },
  });

  await prisma.familyMembership.createMany({
    data: [
      { familyId: family.id, userId: parentUser.id },
      { familyId: family.id, userId: childUser.id },
    ],
  });

  // Legacy Child row retained for rollback compatibility (TD-V2-06).
  // Same id as User so childId and assignedUserId stay in sync (TD-V2-07).
  await prisma.child.create({
    data: {
      id: CHILD_USER_ID,
      name: "Alex",
      familyId: family.id,
    },
  });

  await prisma.chore.createMany({
    data: [
      {
        name: "Make bed",
        description: "Straighten sheets and fluff pillows",
        reward: 1.0,
        status: ChoreStatus.AVAILABLE,
        familyId: family.id,
        createdBy: ChoreCreator.PARENT,
      },
      {
        name: "Feed the dog",
        description: "Morning and evening portions",
        reward: 2.5,
        status: ChoreStatus.AVAILABLE,
        familyId: family.id,
        createdBy: ChoreCreator.PARENT,
      },
      {
        name: "Vacuum living room",
        reward: 3.0,
        status: ChoreStatus.CLAIMED,
        familyId: family.id,
        childId: childUser.id,
        assignedUserId: childUser.id,
        createdBy: ChoreCreator.PARENT,
      },
      {
        name: "Unload dishwasher",
        reward: 2.0,
        status: ChoreStatus.IN_PROGRESS,
        familyId: family.id,
        childId: childUser.id,
        assignedUserId: childUser.id,
        createdBy: ChoreCreator.PARENT,
      },
      {
        name: "Mow the lawn",
        description: "Front and back yard",
        reward: 10.0,
        status: ChoreStatus.PENDING_APPROVAL,
        familyId: family.id,
        childId: childUser.id,
        assignedUserId: childUser.id,
        createdBy: ChoreCreator.PARENT,
      },
      {
        name: "Wash the car",
        reward: 5.0,
        status: ChoreStatus.APPROVED,
        familyId: family.id,
        childId: childUser.id,
        assignedUserId: childUser.id,
        paid: false,
        createdBy: ChoreCreator.PARENT,
      },
    ],
  });

  await prisma.proposal.create({
    data: {
      name: "Organize garage shelves",
      askingReward: 8.0,
      status: ProposalStatus.PENDING,
      familyId: family.id,
      childId: childUser.id,
      proposedByUserId: childUser.id,
    },
  });

  console.log(
    "Seed complete: 1 family, 2 users, 1 legacy child, 6 chores, 1 proposal",
  );
}

async function shutdown() {
  await prisma.$disconnect();
  await pool.end();
}

main()
  .then(shutdown)
  .catch(async (error) => {
    console.error(error);
    await shutdown();
    process.exit(1);
  });
