import { cookies } from "next/headers";

/** ~400 days — convenience-oriented persistence, not a security timeout. */
export const CHILD_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 400;

export const CHILD_SESSION_COOKIE = "choretracker_child_uid";

/** Persist child user id — long-lived httpOnly cookie for trusted-device access. */
export async function setChildSessionUserId(userId: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(CHILD_SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CHILD_SESSION_MAX_AGE_SECONDS,
  });
}
