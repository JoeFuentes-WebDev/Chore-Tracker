import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
  prismaSchemaKey: string | undefined;
};

function getPrismaSchemaKey(): string {
  return Object.values(Prisma.FamilyScalarFieldEnum).join(",");
}

function createPrismaClient(): PrismaClient {
  const pool =
    globalForPrisma.pool ??
    new Pool({
      connectionString: process.env.DATABASE_URL,
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pool = pool;
  }

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

function getPrismaClient(): PrismaClient {
  const schemaKey = getPrismaSchemaKey();
  const cached = globalForPrisma.prisma;

  if (cached && globalForPrisma.prismaSchemaKey === schemaKey) {
    return cached;
  }

  const client = createPrismaClient();

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
    globalForPrisma.prismaSchemaKey = schemaKey;
  }

  return client;
}

export const prisma = getPrismaClient();

/** Hostname from DATABASE_URL used by the Prisma pg Pool (hostname only — no credentials). */
export function getPrismaDatabaseHostname(): string | null {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    return null;
  }

  try {
    const normalized = connectionString.replace(/^postgresql:/i, "postgres:");
    return new URL(normalized).hostname;
  } catch {
    return null;
  }
}

