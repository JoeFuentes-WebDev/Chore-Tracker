// test-prisma.js
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");

console.log("DATABASE_URL present:", !!process.env.DATABASE_URL);

const prisma = new PrismaClient();

console.log("Prisma client created");