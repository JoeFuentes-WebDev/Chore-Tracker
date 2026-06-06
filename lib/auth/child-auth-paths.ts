/** Canonical child board URL. Slug is presentation only. */
export function getChildBoardPath(user: { slug: string }): string {
  return `/child/${user.slug}`;
}

/** Legacy flat board route — redirects to canonical child URL when session exists. */
export function getLegacyChildBoardPath(): string {
  return "/board";
}
