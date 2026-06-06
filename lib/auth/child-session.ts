import { cookies } from "next/headers";

export const CHILD_SESSION_COOKIE = "choretracker_child_uid";

/** Persist child user id after invite acceptance (httpOnly cookie). */
export async function setChildSessionUserId(userId: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(CHILD_SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}
