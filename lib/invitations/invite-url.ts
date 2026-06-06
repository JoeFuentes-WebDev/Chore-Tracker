/** Build absolute invite URL for child onboarding. */
export function getInviteUrl(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "";

  if (!baseUrl) {
    return `/invite/${token}`;
  }

  return `${baseUrl}/invite/${token}`;
}
