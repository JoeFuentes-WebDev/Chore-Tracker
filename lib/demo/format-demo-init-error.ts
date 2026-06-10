import { Prisma } from "@prisma/client";

export function formatDemoInitError(error: unknown): string {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2022") {
      return "Database schema is out of date. Run npm run db:migrate:deploy on production.";
    }

    if (error.code === "P1001" || error.code === "P1002") {
      return "Could not connect to the database. Check DATABASE_URL on Netlify.";
    }
  }

  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("isDemo") || message.includes("Unknown argument")) {
    return "Database schema is out of date. Run npm run db:migrate:deploy on production.";
  }

  if (
    message.includes("ECONNREFUSED") ||
    message.includes("timeout") ||
    message.includes("Timed out")
  ) {
    return "Database connection timed out. Try again in a moment.";
  }

  return "Could not start the demo. Try again in a moment.";
}
