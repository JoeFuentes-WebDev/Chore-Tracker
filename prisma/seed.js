const {
  PrismaClient,
  ChoreStatus,
  ChoreCreator,
  ProposalStatus,
} = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

async function main() {
  await prisma.notificationLog.deleteMany();
  await prisma.chore.deleteMany();
  await prisma.proposal.deleteMany();
  await prisma.child.deleteMany();
  await prisma.family.deleteMany();

  const family = await prisma.family.create({
    data: {
      id: "singleton",
      parentPhone: "+15555550100",
      pinHash: null,
    },
  });

  const child = await prisma.child.create({
    data: {
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
        createdBy: ChoreCreator.PARENT,
      },
      {
        name: "Feed the dog",
        description: "Morning and evening portions",
        reward: 2.5,
        status: ChoreStatus.AVAILABLE,
        createdBy: ChoreCreator.PARENT,
      },
      {
        name: "Vacuum living room",
        reward: 3.0,
        status: ChoreStatus.CLAIMED,
        childId: child.id,
        createdBy: ChoreCreator.PARENT,
      },
      {
        name: "Unload dishwasher",
        reward: 2.0,
        status: ChoreStatus.IN_PROGRESS,
        childId: child.id,
        createdBy: ChoreCreator.PARENT,
      },
      {
        name: "Mow the lawn",
        description: "Front and back yard",
        reward: 10.0,
        status: ChoreStatus.PENDING_APPROVAL,
        childId: child.id,
        createdBy: ChoreCreator.PARENT,
      },
      {
        name: "Wash the car",
        reward: 5.0,
        status: ChoreStatus.APPROVED,
        childId: child.id,
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
      childId: child.id,
    },
  });

  console.log("Seed complete: 1 family, 1 child, 6 chores, 1 proposal");
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
