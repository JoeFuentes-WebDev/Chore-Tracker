# V2-Roadmap.md
## ChoreTracker — V2

---

## Objective

Transform ChoreTracker from a single-family MVP into a reusable multi-family application while preserving the existing chore workflow.

Designed for AI-assisted implementation using Cursor milestone prompts.

---

## Current State (V1 → V2 transition)

### V1 MVP (working)

- Parent creates chore
- Child claims → starts → submits chore
- Parent approves / rejects chore
- Child proposes chore; parent accepts / denies
- Payment tracking (balance settlement)
- Next.js App Router, Server Actions, Prisma, Neon

### V1 assumptions removed in V2

- One parent / one child per deployment
- `getDefaultChild()` / unscoped queries
- No authentication
- No family isolation

### V2-M1 complete ✓

- `User`, `Family`, `FamilyMembership`, `Invitation` models
- User-only identity (`UserRole`: PARENT | CHILD)
- `Chore.familyId`, `Proposal.familyId`
- `assignedUserId` / `proposedByUserId` (dual-column transition with legacy `childId` — see TD-V2-06, TD-V2-07)
- Migrated production family retains `id = "singleton"`
- No auth, routing, or UI in M1 — schema + compatibility shims only

---

## Tech Stack

### Existing

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Prisma 7
- Neon Postgres
- Netlify

### V2 additions

| Milestone | Addition |
|-----------|----------|
| V2-M2 | **Clerk** — parent authentication |
| V2-M4 | Child PIN, trusted device |
| V2-M7 | Web Push (service worker, VAPID) |

New dependencies require explicit approval before install (see `.cursorrules`).

---

## V2 Milestones

---

### V2-M1 — Family / User / Membership / Invitation Schema

**Status:** ✓ Complete

**Goal:** Multi-family data model; preserve V1 workflow via compatibility shims.

**Delivered:**

- `Family`, `User`, `FamilyMembership`, `Invitation`
- Family scoping on `Chore` and `Proposal`
- User-only identity; `Child` deprecated but retained for rollback
- Migration with placeholder parent user on `singleton` family
- `lib/get-default-user.ts` shims until V2-M5

**Reference:** TD-V2-01 through TD-V2-07 in `TechnicalDecisions.md`

---

### V2-M2 — Parent Authentication (Clerk)

**Status:** ✓ Complete

**Goal:** Parents authenticate with Clerk; persistent sessions.

**Delivered:**

- `@clerk/nextjs` integration (ClerkProvider, clerkMiddleware)
- `/sign-in`, `/sign-up` (email/password)
- `/auth/parent/continue` — centralized post-auth redirect
- `User.clerkUserId` sync via `ensureParentUser()`
- Parent auth header on dashboard (sign in / sign out)
- Empty state when authenticated parent has no family
- Temporary post-auth destination: `/dashboard` (M6 → `/parent/[slug]`)

**Out of scope (as planned):** Family creation (M3), child auth (M4), route protection (M5), dynamic routes (M6)

**Reference:** TD-V2-08

---

### V2-M3 — Family Creation

**Status:** ✓ Complete

**Goal:** Authenticated parent creates a family.

**Delivered:**

- Create-family form on dashboard empty state
- `lib/create-family.ts` — transactional `Family` + `FamilyMembership`
- `createFamily` server action (Clerk-authenticated only)
- Chore creation scoped to authenticated parent's `familyId`
- Unauthenticated `/dashboard` retains V1 shim behavior

**Reference:** TD-V2-09

---

### V2-M4 — Child Invitation

**Status:** ✓ Complete

**Goal:** Parent invites children; child onboards via invite link and persists session on device.

**Delivered:**

- `/invite/[token]` — invite landing + join form (name, PIN, confirm PIN)
- Parent dashboard **Invite child** panel (URL generation + copy)
- `createChildInvitation` / `acceptInvitationByToken` server flows
- `User` (CHILD) + `FamilyMembership` + legacy `Child` row on accept
- httpOnly child session cookie (`choretracker_child_uid`)
- Kid board scoped to child session (`getChildBoardContext`)
- `bcryptjs` PIN hashing; `NEXT_PUBLIC_APP_URL` for invite URLs

**Deferred:** PIN return-login, QR code, route protection (V2-M5)

**Reference:** TD-V2-10 in `TechnicalDecisions.md`

**Done when:**

- Parent generates invite; child completes onboarding ✓
- Child session persists family context ✓
- Child can run full chore workflow after onboarding ✓

---

### V2-M5 — Authorization

**Goal:** Enforce family isolation; replace V1 default-user shims.

**Deliverables:**

- Session-scoped queries (`familyId` from session)
- All `lib/*` mutations and reads filtered by family
- Protected routes (middleware)
- Remove `getDefaultChildUser()` / `getDefaultFamily()` shims

**Done when:**

- Parent sees only their family's data
- Child sees only their family's data
- Unauthorized access blocked

---

### V2-M6 — Dynamic Routing

**Goal:** User-scoped URLs; legacy redirects.

**Deliverables:**

- `/parent/[slug]/…` — parent surfaces
- `/child/[slug]/…` — child surfaces
- Redirects: `/dashboard` → `/parent/{slug}/dashboard`, `/board` → `/child/{slug}/board`
- `revalidatePath` updates across server actions

**Done when:**

- Routes generated from user identity
- Existing workflows preserved at new paths

---

### V2-M7 — Push Notifications

**Goal:** Web push for parent and child.

**Deliverables:**

- Permission flow
- Subscription management (`PushSubscription` storage)
- Notification delivery on chore events
- Parent and child notification paths

**Out of scope:** SMS (future backlog)

**Done when:**

- User can opt in to push
- Key events deliver notifications to subscribed devices

---

### V2-M8 — Family Management

**Goal:** Manage household members after initial setup.

**Deliverables:**

- View members
- Invite additional children
- Invite second parent
- Remove member (with guardrails)

**Done when:**

- Family can grow beyond initial parent + first child

---

### V2-M9 — User Settings

**Goal:** Self-service profile and preferences.

**Deliverables:**

- Change PIN (child)
- Edit profile (name, phone for parent)
- Notification preferences (pairs with V2-M7)

**Done when:**

- Users manage their own settings without developer intervention

---

## Architectural Rules

1. **Client Components** must not import runtime values from `@prisma/client`. Use `lib/constants/statuses.ts`.
2. **Server code** owns Prisma; client code consumes DTOs.
3. **Business logic** lives in `lib/`; UI is presentation-focused.
4. **Milestone-driven development** — Implementation Agent builds; human reviews.
5. **Every query/mutation** must include `familyId` from session once V2-M5 ships (TD-V2-04).

---

## Future Backlog (not V2)

### Chore enhancements

- Edit / delete chore
- Chore history
- Rejection notes

### Family features

- SMS reminders
- Multiple guardians (beyond second parent invite)

### Gamification

- Streaks, badges, achievements, levels

### Premium concepts

- Family analytics
- Allowance automation
- Recurring chores
- Scheduled payouts

### Schema cleanup (post-V2-M5)

- Drop deprecated `Child` table and legacy `childId` columns (TD-V2-06, TD-V2-07)

---

## Definition of Done for V2

A new family can:

1. Parent signs up (Clerk)
2. Create a family
3. Invite and onboard a child
4. Login (parent via Clerk; child via PIN on trusted device)
5. Create chores
6. Complete chores
7. Propose chores
8. Approve chores
9. Track and settle earnings

…without developer involvement or seeded data.

---

## Milestone Summary

| Milestone | Focus | Status |
|-----------|-------|--------|
| V2-M1 | Schema foundation | ✓ Complete |
| V2-M2 | Parent auth (Clerk) | ✓ Complete |
| V2-M3 | Family creation | ✓ Complete |
| V2-M4 | Child invitation + session cookie | ✓ Complete |
| V2-M5 | Authorization | Pending |
| V2-M6 | Dynamic routing | Pending |
| V2-M7 | Push notifications | Pending |
| V2-M8 | Family management | Pending |
| V2-M9 | User settings | Pending |
