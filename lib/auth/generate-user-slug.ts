import { prisma } from "@/lib/prisma";

function slugifyBase(value: string): string {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug.length > 0 ? slug : "parent";
}

/** Produce a unique User.slug from display name or email local-part. */
export async function generateUniqueUserSlug(
  name: string,
  email: string | null,
): Promise<string> {
  const emailLocal = email?.split("@")[0] ?? "";
  const base = slugifyBase(name) || slugifyBase(emailLocal) || "parent";

  let candidate = base;
  let suffix = 2;

  while (await prisma.user.findUnique({ where: { slug: candidate } })) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}
