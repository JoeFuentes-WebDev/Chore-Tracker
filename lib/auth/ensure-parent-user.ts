import type { User as ClerkUser } from "@clerk/nextjs/server";
import { UserRole, type User } from "@prisma/client";

import { generateUniqueUserSlug } from "@/lib/auth/generate-user-slug";
import { prisma } from "@/lib/prisma";

function resolveParentName(clerkUser: ClerkUser, email: string | null): string {
  if (clerkUser.fullName && clerkUser.fullName.trim().length > 0) {
    return clerkUser.fullName.trim();
  }

  if (clerkUser.firstName && clerkUser.firstName.trim().length > 0) {
    return clerkUser.firstName.trim();
  }

  if (email) {
    return email.split("@")[0] ?? "Parent";
  }

  return "Parent";
}

/** Idempotent sync: Clerk parent identity → app User row (role PARENT). */
export async function ensureParentUser(clerkUser: ClerkUser): Promise<User> {
  const existing = await prisma.user.findUnique({
    where: { clerkUserId: clerkUser.id },
  });

  if (existing) {
    return existing;
  }

  const email = clerkUser.primaryEmailAddress?.emailAddress ?? null;
  const name = resolveParentName(clerkUser, email);
  const slug = await generateUniqueUserSlug(name, email);

  try {
    return await prisma.user.create({
      data: {
        clerkUserId: clerkUser.id,
        email,
        name,
        slug,
        role: UserRole.PARENT,
      },
    });
  } catch {
    const raced = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
    });

    if (raced) {
      return raced;
    }

    throw new Error("Failed to create parent user.");
  }
}
