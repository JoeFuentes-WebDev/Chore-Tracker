/** Build absolute invite URL for child onboarding. */
export function getInviteUrl(token: string): string {
  const baseUrl = process.env.APP_URL?.replace(/\/$/, "") ?? "";

  if (!baseUrl) {
    return `/invite/${token}`;
  }

  return `${baseUrl}/invite/${token}`;
}
