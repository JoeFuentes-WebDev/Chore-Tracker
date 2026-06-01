import { prisma } from "@/lib/prisma";

/** V1: one child per deployment (TD-07). Returns the sole child record. */
export async function getDefaultChild() {
  const child = await prisma.child.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (!child) {
    throw new Error("No child configured");
  }

  return child;
}
