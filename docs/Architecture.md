# Architecture.md
## ChoreTracker

---

## System Overview

A mobile-first PWA deployed to Vercel. Two distinct experiences — parent and child — served from a single Next.js application. No native app. No app store. Bookmarked URLs are the entry point.

---

## Routes

| Route | Who | Access |
|---|---|---|
| `/` | Anyone | Open — landing page with Parent / Child entry points |
| `/parent` | Parent | PIN protected. No persistent session. PIN required on every visit. First visit: setup flow if no PIN exists. |
| `/parent/settings` | Parent | PIN protected. Change PIN, update phone number. |
| `/child` | Child | Open. No PIN. |

---

## Access Model

**Parent access — bootstrapping:**
- First visit to `/parent`: no PIN exists in the database → skip PIN prompt → render setup screen (set phone number + create PIN)
- Every subsequent visit: PIN prompt. No session persistence. Reload = PIN required.
- Acknowledged tradeoff: the first-visit flow is not airtight. Acceptable for V1 given the app's limited exposure.

**Parent access — PIN reset:**
- Parent requests new PIN via `/parent/settings`
- New PIN delivered via SMS to the phone number stored in the app
- Only one phone number exists in V1

**Child access:**
- Open. No authentication.
- `/child` is the child's bookmarked URL.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js App Router |
| Language | TypeScript |
| Database | Neon (Postgres) |
| ORM | Prisma |
| Styling | Tailwind CSS + shadcn/ui |
| SMS | Twilio |
| Deployment | Vercel |

---

## Major Components

**Landing Page (`/`)**
- Two tappable icons: Parent, Child
- No state, no data fetching

**Parent Shell (`/parent`)**
- PIN gate component — renders on every load before any parent content
- Setup screen — renders in place of PIN gate when no PIN exists in DB
- After PIN accepted: full parent dashboard

**Parent Dashboard**
- Chore board — all chores and their current states
- Pending approvals — chores awaiting review
- Earnings tracker — total owed per child
- Proposals inbox — child-submitted proposals

**Parent Settings (`/parent/settings`)**
- Change PIN
- Update phone number

**Child View (`/child`)**
- Available chores board
- My chores — claimed, in progress, pending, approved
- Propose a chore
- Earnings summary

---

## Data Model (conceptual)

**Family**
- One family per deployment (V1)
- Stores: parent phone number, PIN (hashed)

**Child**
- Name
- belongs to Family
- V1: one child. Schema supports multiple.

**Chore**
- Name, description
- Reward amount, currency type (USD in V1)
- Status (see state machine below)
- Assigned to Child (nullable — null = available)
- Rejection comment (nullable)
- Created by: parent or child (proposal)

**Proposal**
- Child-submitted chore suggestion
- Asking reward
- Counter reward (nullable — set by parent)
- Status: pending / accepted / countered

**Notification Log**
- Records every SMS sent
- Chore reference, timestamp, delivery status

---

## Chore State Machine

```
Available
   ↓ child claims
Claimed
   ↓ child begins work
In Progress
   ↓ child marks complete
Pending Approval
   ↓ parent approves       ↓ parent rejects (with comment)
Approved              In Progress (rejection comment visible to child)
```

---

## Proposal State Machine

```
Proposed (child: name + asking reward)
   ↓ parent accepts at ask    ↓ parent counters (lower reward)
Available (at ask price)    Available (at counter price)
                                ↓ child claims = implicit acceptance
                             Claimed
```

---

## SMS Notifications

**Trigger:** Child marks a chore complete → status moves to Pending Approval
**Action:** Twilio sends SMS to parent's stored phone number
**Direction:** One-way (V1). Parent acts in the app, not via SMS reply.
**Content:** Chore name + child name + link to `/parent`

---

## Data Flow — Core Flows

**Chore Completion Flow**
1. Child taps "Mark Complete" on a claimed chore
2. Chore status → Pending Approval
3. API calls Twilio → SMS sent to parent
4. SMS logged in Notification Log
5. Parent opens `/parent`, enters PIN
6. Parent sees chore in Pending Approvals
7. Parent approves → status → Approved, earnings updated
8. Parent rejects → status → In Progress, comment stored, visible to child

**Proposal Flow**
1. Child submits proposal (name + asking reward)
2. Proposal appears in Parent's proposals inbox
3. Parent accepts at ask → chore created at asking price → Available
4. Parent counters → chore created at counter price → Available
5. Child sees chore on board, claims it → implicit acceptance

**PIN Reset Flow**
1. Parent taps "Forgot PIN" on PIN gate
2. API sends SMS with new PIN to stored phone number
3. Parent enters new PIN
4. New PIN replaces old PIN in DB (hashed)

---

## Constraints and Decisions

| Decision | Rationale |
|---|---|
| No persistent session | Simplicity. PIN on every load is acceptable given household use. |
| First-visit no-PIN bootstrap | No way to set a PIN without being logged in. Accepted tradeoff for V1. |
| One family per deployment | Eliminates multi-tenancy complexity entirely for V1. |
| One-way SMS | Two-way Twilio adds webhook complexity. Not needed for V1. |
| Child view is open | Child is a trusted household user. PIN adds friction with no meaningful security gain. |
| Schema supports multiple children | Multi-child UI is V2. Schema rewrite later would be costly. |

