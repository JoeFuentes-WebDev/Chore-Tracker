import { getPrismaDatabaseHostname, prisma } from "@/lib/prisma";

/** TEMP V2 diagnostics — remove after DATABASE_URL mismatch is verified. */
export async function logRuntimeDbContext(source: string): Promise<void> {
  const hostname = getPrismaDatabaseHostname();

  console.log(`[TEMP DB DIAG] source=${source} prisma_hostname=${hostname ?? "unknown"}`);

  try {
    const dbInfo = await prisma.$queryRaw<
      Array<{ current_database: string; current_schema: string }>
    >`SELECT current_database(), current_schema()`;

    console.log(`[TEMP DB DIAG] source=${source} db_info=`, dbInfo[0] ?? null);

    const userCount = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*)::bigint AS count FROM "User"
    `;

    console.log(
      `[TEMP DB DIAG] source=${source} user_count=`,
      userCount[0]?.count?.toString() ?? null,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[TEMP DB DIAG] source=${source} query_failed=${message}`);
  }
}
