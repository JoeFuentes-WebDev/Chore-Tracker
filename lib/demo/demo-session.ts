import { cookies } from "next/headers";

/** Demo family id — shared by parent and child surfaces for this browser session. */
export const DEMO_SESSION_COOKIE = "demo_session";

/** Aligns with nightly cron wipe and demo family TTL. */
export const DEMO_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24;

export function getDemoSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DEMO_SESSION_MAX_AGE_SECONDS,
  };
}

export async function getDemoSessionFamilyId(): Promise<string | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(DEMO_SESSION_COOKIE)?.value?.trim();

  return value && value.length > 0 ? value : null;
}

/** Set demo cookie — call from a Route Handler or Server Action only. */
export async function setDemoSessionFamilyId(familyId: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(DEMO_SESSION_COOKIE, familyId, getDemoSessionCookieOptions());
}

/** Clear demo cookie — call from a Route Handler or Server Action only. */
export async function clearDemoSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(DEMO_SESSION_COOKIE);
}
