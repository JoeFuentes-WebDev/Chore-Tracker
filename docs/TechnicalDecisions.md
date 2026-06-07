# TechnicalDecisions.md
## ChoreTracker — V1

---

## How to Read This Document

Each entry follows this format:
- **Decision** — what was decided
- **Alternatives** — what else was considered
- **Rationale** — why this one
- **Tradeoffs** — what we're giving up
- **Revisit when** — what would trigger a change

---

## TD-01 — Tech Stack

**Decision:** Next.js App Router, TypeScript, Neon (Postgres), Prisma, Tailwind, shadcn/ui, Twilio, Vercel.

**Alternatives:** Remix, plain React + Express, Supabase, Drizzle, PlanetScale.

**Rationale:** Same stack as QOA. No ramp-up time, established patterns, known deployment behavior.

**Tradeoffs:** Stack may not be the optimal fit for every future project. Accepted for speed on V1.

**Revisit when:** Starting a new project where requirements favor a different stack.

---

## TD-02 — PIN Hashing

**Decision:** `bcryptjs` npm package. PIN hashed before storage. Never stored in plaintext.

**Alternatives:** `argon2`, plain SHA-256, no hashing.

**Rationale:** bcryptjs is zero cost, built into Node, industry standard, no native dependencies.

**Tradeoffs:** Slightly slower than argon2. Irrelevant at this scale.

**Revisit when:** Never for V1. Argon2 is a V2+ consideration if security requirements increase.

---

## TD-03 — No Persistent Session

**Decision:** PIN is required on every visit to `/parent`. No cookies, no tokens, no session storage.

**Alternatives:** JWT session cookie, NextAuth, Supabase Auth.

**Rationale:** Household app with limited exposure. Persistent sessions add complexity with minimal security gain in this context.

**Tradeoffs:** Parent re-enters PIN on every reload. Slightly more friction.

**Revisit when:** App scales beyond single household or requires multi-device session consistency.

---

## TD-04 — First-Visit Bootstrap

**Decision:** First visit to `/parent` with no PIN in the database skips the PIN gate and renders a setup screen. Parent sets phone number and creates PIN. All subsequent visits require PIN.

**Alternatives:** Ship with a hardcoded default PIN (e.g. `0000`). Seed the database manually before deploy.

**Rationale:** Simplest zero-config onboarding. No manual DB seeding required.

**Tradeoffs:** The window between first deploy and PIN creation is unprotected. Accepted for V1 given limited exposure.

**Revisit when:** App is distributed to multiple families (multi-tenancy), where unprotected bootstrap becomes a real risk.

---

## TD-05 — One Family Per Deployment

**Decision:** The database represents a single family. No multi-tenancy. No accounts.

**Alternatives:** Multi-tenant with family accounts and login.

**Rationale:** Eliminates tenancy complexity entirely. Each family deploys their own instance.

**Tradeoffs:** Not a SaaS product. Each family manages their own Vercel deployment.

**Revisit when:** Product pivots to a hosted multi-family SaaS model.

---

## TD-06 — Child View Is Open

**Decision:** `/child` requires no PIN and no authentication.

**Alternatives:** Child PIN, child account, parent-set child passcode.

**Rationale:** Child is a trusted household user. A PIN adds friction with no meaningful security benefit in a home context.

**Tradeoffs:** Anyone with the URL can access the child view.

**Revisit when:** App is used outside the household or child privacy becomes a concern.

---

## TD-07 — Schema Supports Multiple Children, UI Does Not

**Decision:** The `Child` model has a foreign key to `Family`. The schema supports multiple children per family from day one. V1 UI exposes only one child.

**Alternatives:** Build single-child schema now, migrate later.

**Rationale:** Schema migration to add multi-child support after launch is costly and risky. One extra foreign key now costs nothing.

**Tradeoffs:** Slightly more complex schema than strictly necessary for V1.

**Revisit when:** V2 multi-child UI is built — schema is already ready.

---

## TD-08 — Chore Unclaim

**Decision:** A child can unclaim a chore. Chore returns to Available. Parent is notified via immediate SMS on both claim and unclaim events.

**Alternatives:** No unclaim allowed. Unclaim requires parent approval.

**Rationale:** Kids change their minds. Locking a chore creates friction and requires parent intervention for a minor action.

**Tradeoffs:** Parent receives an SMS for every claim and unclaim. Could be noisy.

**Revisit when:** SMS noise becomes a complaint. V2 candidate: batch notifications or web push.

---

## TD-09 — SMS Immediate, One-Way

**Decision:** Twilio SMS fires immediately on trigger events. One-way only — parent cannot reply via SMS to approve or reject.

**Alternatives:** Batch/debounce notifications (2-minute window). Two-way SMS reply for approvals.

**Rationale:** Immediate is reliable. Client-side debounce fails if the tab closes. Two-way SMS requires Twilio webhook infrastructure.

**Tradeoffs:** Potentially noisy on claim/unclaim activity. No approve-by-reply convenience.

**Revisit when:** SMS noise is a real complaint → explore batch via Upstash QStash. Convenience is a priority → explore two-way SMS or web push.

---

## TD-10 — Batch SMS Deferred

**Decision:** No batching in V1. Each trigger fires its own SMS.

**Alternatives:** Client-side debounce (unreliable on tab close). Server-side queue via Upstash QStash.

**Rationale:** Client debounce is unreliable. QStash adds infrastructure complexity not justified for V1.

**Tradeoffs:** More SMS volume than necessary in active sessions.

**Revisit when:** SMS cost or notification noise becomes a real problem.

---

## TD-11 — Web Push Deferred

**Decision:** No web push notifications in V1. SMS only.

**Alternatives:** Web Push API via service worker + PWA install.

**Rationale:** Web Push requires service worker, granted permissions, and PWA installed to home screen. SMS works without any of that.

**Tradeoffs:** SMS costs per message. Web Push is free.

**Revisit when:** V2. Infrastructure already partially in place given PWA architecture.

---

## TD-12 — Proposal Rejection

**Decision:** Parent can reject a proposal outright. Rejected proposal requires child acknowledgment before parent can delete it.

**Alternatives:** Parent silently deletes. Auto-expire unreviewed proposals.

**Rationale:** Child should know their proposal was seen and rejected, not just disappeared.

**Tradeoffs:** Adds an acknowledgment state to the proposal flow.

**Revisit when:** V2 — add rejection reason field, visible to both parent and child.

---

## TD-13 — Earnings Model

**Decision:** Balance is derived — calculated at runtime by summing Approved + unpaid chores. No stored balance field. Each Approved chore carries a `paid` boolean (default false).

**Alternatives:** Stored running balance on Child record. Separate Payment ledger table.

**Rationale:** Derived balance is always accurate. No risk of balance getting out of sync with chore records. `paid` boolean is the simplest possible settlement mechanism.

**Tradeoffs:** Slightly more expensive query than reading a stored field. Irrelevant at household scale.

**Pay flow:**
1. Parent taps balance → "Pay?" modal
2. Confirms → all Approved + unpaid chores flip `paid = true`
3. Balance recalculates to zero
4. Paid chores drop off child's active view

**V1 displays:** Current unpaid balance only. No lifetime earnings total.

**Revisit when:** V2 — add earnings history, lifetime total, paid chores tab.

---

## TD-14 — Vercel maxDuration on SMS Routes

**Decision:** All API routes that call Twilio set `export const maxDuration = 60`.

**Alternatives:** Accept default 10-second timeout.

**Rationale:** Twilio calls are external HTTP requests. Default 10s timeout can be exceeded under load or latency. Learned from QOA.

**Tradeoffs:** Longer max execution window. No real downside at this scale.

**Revisit when:** Never. This is a standing practice on all Vercel projects using external HTTP calls.

---

## TD-15 — Single Chore Entity (No Task Split)

**Decision:** One `Chore` model carries the full lifecycle — status, assignment, reward, rejection comment, and `paid` flag. No separate `Task` instance table. The existing `Chore`/`Task` split in `prisma/schema.prisma` is rejected.

**Alternatives:** Chore definition + Task instance split (current exploratory schema); separate completion/history ledger table.

**Rationale:** Matches `Architecture.md` and BuildPlan Milestone 1. V1 has no recurring chores (MVP out of scope), so instance snapshots are unnecessary. Simpler queries, fewer joins, and direct mapping to the documented state machine (Available → Claimed → In Progress → Pending Approval → Approved).

**Tradeoffs:** No built-in history if the same chore name is re-offered after payment. A chore row represents one unit of work through its lifecycle, not a reusable template. V2 analytics or "do this chore again" flows may require a completion ledger or chore template model.

**Revisit when:** V2 needs recurring chores, chore templates, or earnings/completion history beyond the current row.

---

## TD-19 — Cross-Surface Revalidation on Parent Approve

**Decision:** The `approveChore` server action calls `revalidatePath("/dashboard")` and `revalidatePath("/board")` after a successful approval.

**Alternatives:** Revalidate `/dashboard` only; use a shared cache tag.

**Rationale:** Kid earnings are derived from `APPROVED` + `paid: false` on `/board`. Parent approve must invalidate the kid read model immediately so earnings reflect the approval without a manual refresh strategy on the child surface.

**Tradeoffs:** Parent mutation knows about the child route path. Acceptable at V1 scale with two surfaces.

**Revisit when:** Shared cache tags or a unified revalidation helper is introduced across surfaces.

---

## TD-20 — Reject Returns to IN_PROGRESS (No Comment)

**Decision:** Rejecting a submitted chore transitions `PENDING_APPROVAL → IN_PROGRESS`. No rejection comment, reason field, or dedicated `REJECTED` status in this milestone.

**Alternatives:** Store rejection comment (BuildPlan M5); introduce a `REJECTED` dead-end status.

**Rationale:** Milestone scope keeps the workflow simple — child can fix and resubmit immediately via existing Finish action. Avoids schema/UI complexity until comment display is implemented.

**Tradeoffs:** Child does not see why work was rejected. Parent cannot leave feedback yet.

**Revisit when:** Rejection comment milestone ships (Architecture chore completion flow step 8).

---

## TD-21 — Parent Create Chore on Dashboard

**Decision:** Parents create chores via a form on `/dashboard`. New rows are inserted with `status = AVAILABLE`, `createdBy = PARENT`, and `childId = null`. The `createChore` server action revalidates `/board` only.

**Alternatives:** Create on `/manage`; use POST `/api/chores`.

**Rationale:** Milestone places creation on the Parent Dashboard. Server action + Prisma matches existing kid/parent mutation pattern. Child available list is the only surface that changes on create.

**Tradeoffs:** Parent dashboard does not list available chores — parent confirms via success message and child board.

**Revisit when:** Parent chore management (edit/delete board) ships on `/manage`.

---

## TD-22 — Proposal Description Deferred (M10)

**Decision:** M10 proposal creation collects name and requested reward only. The `Proposal` model has no `description` column; no schema migration in this milestone.

**Alternatives:** Add `description String?` to `Proposal`; store description in `name` field.

**Rationale:** Architecture and existing schema define proposals as name + asking reward. Avoids migration scope in a read/create-only milestone.

**Tradeoffs:** Child cannot add context to a proposal until a future schema change.

**Revisit when:** Product requires proposal descriptions — add nullable `description` to `Proposal`.

---

## TD-23 — Kid Proposals on `/board` (Not `/propose`)

**Decision:** Proposal creation form and My Proposals list live on `/board` in dedicated sections below chore lists. The `/propose` route remains unimplemented.

**Alternatives:** Implement on `/propose` only; duplicate on both routes.

**Rationale:** M10 explicitly places the flow on the Child Dashboard and separates proposals from chore sections.

**Tradeoffs:** `/propose` stub remains empty until a future routing/nav milestone.

**Revisit when:** BottomNav wires kid navigation to `/propose` as a separate screen.

---

## TD-24 — Proposal Deny Maps to `REJECTED` Status

**Decision:** Denying a proposal sets `ProposalStatus.REJECTED` in the database. UI labels this "Denied" on both parent and child surfaces. Milestone terminology uses DENIED; schema enum uses REJECTED (distinct from chore workflow REJECTED, which does not exist as a status).

**Alternatives:** Add `DENIED` to `ProposalStatus` enum via migration; rename `REJECTED` to `DENIED`.

**Rationale:** Schema already defines `REJECTED` for proposals (TD-12). Avoids migration in M11. Display layer bridges terminology gap.

**Tradeoffs:** Developers must remember REJECTED (proposal) displays as "Denied" while chore rejections use IN_PROGRESS, not a REJECTED status.

**Revisit when:** Schema enum is normalized across docs and code.

---

## TD-25 — Accept Proposal Creates Child-Authored AVAILABLE Chore

**Decision:** Accepting a proposal runs a transaction: `PENDING → ACCEPTED`, then creates a `Chore` with proposal name, null description, asking reward, `status = AVAILABLE`, `createdBy = CHILD`, `sourceProposalId` set, `childId = null`. Accept/deny actions revalidate `/dashboard` and `/board`.

**Alternatives:** `createdBy = PARENT`; create chore outside transaction.

**Rationale:** Architecture states chores from proposals are child-authored. Transaction prevents orphaned ACCEPTED proposals or duplicate chores on race. Kid board must show new available chore and updated proposal status immediately.

**Tradeoffs:** Proposal has no description column (TD-22) — accepted chore description is always null until schema adds proposal descriptions.

**Revisit when:** Proposal descriptions ship; counter-offer flow (M BuildPlan) adds `COUNTERED` path.

---

## TD-27 — Accept Proposal Uses Nested Create + Orphan Recovery

**Decision:** Accepting a proposal uses a single transaction with Prisma nested `createdChore.create` on the proposal update. If a proposal is already `ACCEPTED` but has no linked chore (orphaned state), accept creates the missing `AVAILABLE` chore idempotently. If a linked chore already exists, accept returns success without duplicating.

**Alternatives:** Separate `updateMany` + `chore.create` calls; fail permanently on orphaned `ACCEPTED` rows.

**Rationale:** Orphaned `ACCEPTED` proposals (status updated without chore) could not be re-accepted because guards only matched `PENDING`. Nested create ties status transition and chore creation atomically through the one-to-one relation.

**Tradeoffs:** Accept on an already-accepted proposal with an existing chore is a no-op success — intentional idempotency.

**Revisit when:** Proposal acceptance adds counter-reward or edits requiring a different chore shape.

---

## TD-26 — Balance Settlement via `paid` Flag (M12)

**Decision:** Settlement marks all `APPROVED` + `paid: false` chores as `paid: true` in a single Prisma transaction. Chore `status` remains `APPROVED`; "PAID" is represented by the boolean, not a new enum value (TD-13). Parent Pay Balance requires a confirmation modal per TD-13 pay flow. Both `/dashboard` and `/board` revalidate after settlement.

**Alternatives:** Add `PAID` to `ChoreStatus` enum; pay without confirmation; per-chore pay buttons.

**Rationale:** Matches TD-13 derived balance model and milestone bulk-settlement requirement. Confirmation aligns with `.cursorrules` financial-action rule and TD-13 pay flow.

**Tradeoffs:** Paid chores remain `APPROVED` in the database — queries must always filter on `paid` when computing outstanding balance.

**Revisit when:** Payment history or per-chore settlement ships (explicitly out of scope for M12).

---

## V2 Technical Decisions

---

## TD-V2-01 — Multi-Family Architecture

**Decision:** The database supports multiple families. Migrated production data retains `Family.id = "singleton"`. New families receive `cuid()` ids.

**Alternatives:** Retain one-family-per-deployment (TD-05); rewrite singleton id on migration.

**Rationale:** V2 requires multi-tenancy in a shared Neon database. Preserving `"singleton"` avoids cascading FK rewrites on production migration.

**Tradeoffs:** One legacy id remains in the schema permanently unless a future cleanup migration rewrites it.

**Revisit when:** Never for migrated production row unless a dedicated id-normalization milestone is approved.

---

## TD-V2-02 — User-Only Identity

**Decision:** `User` is the sole identity entity. Roles are `PARENT` or `CHILD` via `UserRole` enum. No separate Parent or Child tables long-term.

**Alternatives:** Keep `Child` as a profile table linked to `User`; separate Parent table.

**Rationale:** Fewer concepts for onboarding, auth, and routing. One membership join path.

**Tradeoffs:** Kid-specific fields (avatar, age) would require extending `User` or a profile extension table later.

**Revisit when:** Kid-specific profile data beyond name/slug is required.

---

## TD-V2-03 — FamilyMembership Model

**Decision:** `FamilyMembership` links users to families. `userId` is unique — one family per user in V2.

**Alternatives:** Many-to-many membership (user in multiple families).

**Rationale:** Matches household use case and simplifies session shape for V2-M2.

**Tradeoffs:** Blended families or shared custody across households would require schema change.

**Revisit when:** Product requires multi-family membership for a single user.

---

## TD-V2-04 — Family Scoping on Chore and Proposal

**Decision:** `Chore.familyId` and `Proposal.familyId` are required. Authorization filtering lands in V2-M5; columns are populated in V2-M1.

**Alternatives:** Infer family via `assignedUserId` / `Child.familyId` joins only.

**Rationale:** Available chores have no assignee — family cannot be inferred from user FK alone.

**Tradeoffs:** Mutations must set `familyId` explicitly until session-scoped helpers exist.

**Revisit when:** V2-M5 authorization middleware ships.

---

## TD-V2-05 — UserRole vs ChoreCreator

**Decision:** `UserRole` (identity) and `ChoreCreator` (provenance) are separate enums with overlapping labels (`PARENT`, `CHILD`).

**Alternatives:** Single shared enum.

**Rationale:** Identity role and chore authorship are different concepts; conflating enums causes import and client-boundary confusion.

**Tradeoffs:** Developers must use the correct enum per context.

**Revisit when:** Never — naming is intentional.

---

## TD-V2-06 — Child Model Deprecated (Temporary Retention)

**Decision:** The V1 `Child` model is deprecated but **not dropped** in V2-M1. Application code uses `User` exclusively. `Child` rows remain for production rollback.

**Alternatives:** Drop `Child` in V2-M1 (Option A); keep `Child` as permanent profile table.

**Rationale:** Deployed production system — rollback to V1 app is possible while legacy table and `childId` columns exist.

**Tradeoffs:** Redundant data until cleanup milestone. Must keep dual columns in sync on writes.

**Revisit when:** Cleanup milestone after V2-M5 proves User-based flows in production.

---

## TD-V2-07 — Dual FK Transition (childId + assignedUserId)

**Decision:** V2-M1 adds `assignedUserId` / `proposedByUserId` pointing to `User`. Legacy `childId` columns on `Chore` and `Proposal` are retained and kept in sync on writes. Migration preserves `Child.id` as `User.id` for existing rows.

**Alternatives:** Rename-only migration with immediate `Child` drop.

**Rationale:** Safer production migration and V1 app rollback path (TD-V2-06).

**Tradeoffs:** Wider schema temporarily; mutations must update both FK columns when assigning.

**Revisit when:** Cleanup milestone drops `childId` and `Child` table.

---

## TD-V2-08 — Clerk Parent Authentication (V2-M2)

**Decision:** Parents authenticate via Clerk (`@clerk/nextjs`) with email/password. `User.clerkUserId` links Clerk identity to the app `User` row. Children are not Clerk users. Parent PIN auth is not used when `clerkUserId` is set.

**Alternatives:** Auth.js credentials provider; custom JWT session.

**Rationale:** Clerk handles sign-up, sign-in, session persistence, and password management without custom auth infrastructure. Clear separation from child PIN + trusted-device auth (V2-M4).

**Tradeoffs:** Two auth systems (Clerk for parents, app-managed for children). New dependency and Clerk Dashboard configuration required.

**Post-auth routing:** Centralized in `lib/auth/parent-auth-paths.ts` and `/auth/parent/continue`. M2 uses temporary `/dashboard`; M6 switches `getParentPostAuthPath()` to `/parent/[slug]`.

**FamilyMembership:** Not created in M2. Authenticated parents without membership see an empty state until V2-M3.

**Route protection:** Deferred to V2-M5. M2 middleware propagates Clerk session only.

**Revisit when:** V2-M3 (family creation), V2-M5 (authorization), V2-M6 (canonical routes).

---

## TD-V2-09 — Parent Family Creation (V2-M3)

**Decision:** Authenticated parents without a `FamilyMembership` create a family via a dashboard form. A single transaction creates `Family` + `FamilyMembership`. The creating parent is the implicit owner (no admin role field). One family per user enforced by `FamilyMembership.userId @unique`.

**Alternatives:** Separate onboarding route; admin role on membership; auto-create family at Clerk sign-up.

**Rationale:** Keeps M3 scope minimal. Parent must name their household. Membership gate is already in schema.

**Tradeoffs:** No invite flow until M4. Chore creation must pass authenticated `familyId` — shim `getDefaultFamily()` remains for anonymous dashboard only.

**Revisit when:** V2-M4 (child invitation), V2-M8 (second parent, explicit roles if needed).

---

## TD-V2-10 — Child Invitation and Session (V2-M4)

**Decision:** Parents invite children via a time-limited URL at `/invite/[token]`. Multiple active invitations per family are allowed. On accept, the child sets name + 4-digit PIN; PIN is hashed with `bcryptjs` and stored on `User.pinHash`. A legacy `Child` row is created with the same id as the new `User` for dual-FK compatibility (TD-V2-06/07). Child session is an httpOnly cookie (`choretracker_child_uid`) set on accept; no PIN return-login in M4.

**Alternatives:** Clerk for children; single active invite per family; JWT in localStorage; `/join/{token}` route.

**Rationale:** Keeps child auth separate from Clerk. Cookie session is sufficient for trusted-device persistence until M5 authorization. Invite URLs use `NEXT_PUBLIC_APP_URL` for environment-correct links.

**Tradeoffs:** PIN return-login and QR code deferred. Board still falls back to V1 shim when no child cookie (until M5). No route protection on `/board` yet.

**Revisit when:** V2-M5 (authorization, remove shims), future milestone for PIN return-login and QR.

---

## TD-V2-11 — Identity Resolution & Family Scoping (V2-M5)

**Decision:** All reads and mutations resolve `familyId` from session — never from request parameters or V1 default-family shims. Parents: Clerk → `User` → `FamilyMembership`. Children: httpOnly cookie → `User` → `FamilyMembership`. Lib mutations accept a `FamilyScope` and include `familyId` in Prisma `where` clauses. Anonymous `/dashboard` redirects to `/sign-in`; `/board` without child session shows an empty state.

**Alternatives:** Middleware-only protection without lib-layer scoping; retain anonymous dashboard with default family for dev.

**Rationale:** Defense in depth — even if a cross-family entity id is known, mutations no-op. Removes `getDefaultFamily()` / `getDefaultChildUser()` footguns in a multi-tenant database.

**Tradeoffs:** V1 anonymous dashboard demo removed. Middleware route protection deferred to M6. PIN return-login still deferred.

**Revisit when:** V2-M6 (dynamic routes, middleware), schema cleanup milestone.

---

## TD-V2-12 — Human-Friendly Identity URLs (V2-M6)

**Decision:** Canonical parent and child surfaces live at `/parent/[slug]` and `/child/[slug]`. Legacy `/dashboard` and `/board` redirect to the session user's slug URL. Route `slug` is presentation only — identity, authorization, and `familyId` always come from session resolution (TD-V2-11). Mismatched slug redirects to the session user's canonical path.

**Alternatives:** Nested paths (`/parent/[slug]/dashboard`); family slugs in URLs; authorize by slug param.

**Rationale:** Human-readable bookmarks without exposing family as a public routing concept. Preserves M5 security model.

**Tradeoffs:** Server actions must revalidate canonical paths plus legacy redirects. Parent actions affecting child data use layout-level revalidation under `/child`.

**Revisit when:** Additional parent/child sub-routes (manage, settings) migrate under same slug prefix.

---

## TD-V2-13 — Flat Identity Routes (V2-M6.1)

**Decision:** Canonical surfaces are `/parent` and `/child` with no user slug in the URL. Legacy `/dashboard`, `/board`, `/parent/[slug]`, and `/child/[slug]` redirect to flat routes. Session resolution (TD-V2-11) remains the sole authority for identity and family scoping. `User.slug` is retained in schema and generation logic but is not used for routing.

**Alternatives:** Keep slug URLs (TD-V2-12); family slugs in URLs.

**Rationale:** Private family app — display names belong in UI, not URLs. M5 already scoped all data by session; slugs added no security value.

**Tradeoffs:** TD-V2-12 slug URLs deprecated via compatibility redirects only.

**Revisit when:** Never for routing — slug column may be repurposed or dropped in schema cleanup milestone.

---

## TD-V2-14 — Child Identity & Recovery Model (V2-M7)

**Decision:** Normal child usage is identity via a long-lived httpOnly session cookie (`choretracker_child_uid`, ~400 days). The cookie is convenience-oriented — not a security inactivity timeout. Children who return after weeks or months retain access if the cookie is still present. When the cookie is lost (new device, cleared browser data), the child sees `ChildSessionEmptyState` on `/child` with no self-service recovery. Parents restore access by generating a recovery invitation (`Invitation.userId` linked to existing child); accept issues a fresh cookie only — no new User, FamilyMembership, or Child rows.

**Alternatives:** Child login screen; forgot/reset PIN; PIN re-entry on recovery; session cookies without maxAge (browser session only).

**Rationale:** Parents control family membership. Children are not Clerk users. PIN is collected at onboarding and stored hashed but has no login flow — PIN recovery would require child self-service auth explicitly rejected by product model.

**Security:** Recovery invites are single-use, expiring, family-scoped, and child-scoped. Accept re-verifies FamilyMembership before setting cookie. Net-new invites (`userId` null) remain separate onboarding path.

**Tradeoffs:** Lost cookie requires parent action. Long-lived cookie on shared devices is a household trust assumption (acceptable for private family PWA).

**Revisit when:** Optional PIN return-login milestone; push notifications (M8) for parent-initiated nudges.

---

## TD-V2-15 — Push Notifications & Notification Abstraction (V2-M8)

**Decision:** Family notifications use a single `sendNotification()` entry point. V2-M8 implements **Web Push only** via `PushSubscription` rows per user (multiple devices allowed). SMS is explicitly deferred to V3; email is not planned for V2. Dispatch is **fire-and-forget** from server actions after successful mutations — delivery failure never blocks chore/proposal workflows.

**Minimal notification philosophy:** Notify only when someone must act or receives a meaningful outcome.

| Event | Direction |
|-------|-----------|
| New AVAILABLE chore | Parent → all children |
| Proposal submitted | Child → all parents |
| Chore completed (pending approval) | Child → all parents |
| Proposal approved | Parent → proposing child |
| Proposal denied | Parent → proposing child |

**Explicitly excluded from M8:** balance paid, chore claimed/started, dashboard noise.

**Stale subscriptions:** `web-push` 404/410 responses delete the `PushSubscription` row automatically.

**Alternatives:** SMS via Twilio (V1 stub); unified `NotificationLog` for all channels; user notification preferences.

**Rationale:** Push is free, fits PWA, and avoids SMS cost/complexity in V2. Single abstraction allows V3 SMS without changing dispatch call sites.

**Tradeoffs:** No prefs — all subscribed devices receive all event types. Subscribe is best-effort on page load (no settings UI). Requires VAPID keys and granted browser permission.

**Future note:** `payBalance` today settles family-wide approved chores; multi-child households will need per-child settlement before pay-related notifications make sense.

**Revisit when:** V3 SMS channel; notification preferences milestone; multi-child settlement.

