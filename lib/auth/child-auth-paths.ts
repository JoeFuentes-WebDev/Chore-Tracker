/** Canonical child board URL. */
export function getChildBoardPath(): string {
  return "/child";
}

/** Legacy slug-based child URL — redirects to /child. */
export function getLegacyChildSlugPath(user: { slug: string }): string {
  return `/child/${user.slug}`;
}

/** Legacy flat board route — redirects to /child when session exists. */
export function getLegacyChildBoardPath(): string {
  return "/board";
}
