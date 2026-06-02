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

