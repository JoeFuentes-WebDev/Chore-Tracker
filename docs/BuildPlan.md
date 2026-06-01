# BuildPlan.md
## ChoreTracker — V1

---

## Sequencing Rationale

Each milestone produces working, testable software before the next begins. No milestone depends on a future one. Foundation first, user-facing experiences second, integrations and money last.

---

## Milestone 1 — Foundation

**Goal:** Database is live, schema is correct, seed data exists for development.

**Deliverables:**
- Prisma schema — Family, Child, Chore, Proposal, NotificationLog models
- Migrations — clean initial migration applied to Neon
- Seed data — one family, one parent phone, one child, a handful of chores in various states

**Done when:** `prisma studio` shows seeded data. All models and relations resolve without error.

---

## Milestone 2 — Parent Access

**Goal:** Parent can reach their dashboard. PIN flow works end-to-end.

**Deliverables:**
- First-visit bootstrap — no PIN in DB renders setup screen (phone number + create PIN)
- PIN creation — bcryptjs hash stored in DB
- PIN validation — `/parent` gate checks hash on every load
- PIN reset via SMS — Twilio sends new PIN to stored phone number
- Change PIN — available inside `/parent/settings`
- Parent shell — authenticated layout, navigation, placeholder content areas

**Done when:** Fresh deployment shows setup screen. After setup, PIN gate appears on every reload. Wrong PIN blocks access. SMS PIN reset delivers and works.

---

## Milestone 3 — Chore Management

**Goal:** Parent can build and manage the chore board.

**Deliverables:**
- Create chore — name, description, reward amount (USD)
- Edit chore — update any field
- Delete chore — removes from board (only if status is Available)
- Chore board — parent view of all chores with current status visible

**Done when:** Parent can create, edit, and delete chores. Board reflects current state accurately.

---

## Milestone 4 — Child Experience

**Goal:** Child can see the board, claim a chore, and mark it complete.

**Deliverables:**
- Child view — `/child` shows all Available chores with reward amounts
- Claim — chore moves from Available → Claimed → In Progress, SMS fires to parent
- Unclaim — chore returns to Available, SMS fires to parent
- Mark complete — chore moves to Pending Approval, SMS fires to parent
- My chores — child sees their active chores and current status

**Done when:** Child can complete the full loop from seeing a chore to marking it done. Parent receives SMS at each trigger point.

---

## Milestone 5 — Approvals

**Goal:** Parent can review completed chores and approve or reject them.

**Deliverables:**
- Pending approvals queue — parent sees all chores in Pending Approval state
- Approve — chore moves to Approved, `paid = false`, balance updates
- Reject — chore returns to In Progress, rejection comment stored
- Rejection comment — visible to child on their active chores view
- Re-submission — child can mark the chore complete again after a rejection

**Done when:** Full approval loop works. Rejection comment visible to child. Child can resubmit after rejection.

---

## Milestone 6 — SMS

**Goal:** All SMS triggers are wired, reliable, and logged.

**Deliverables:**
- Twilio integration — API credentials configured via environment variables
- Triggers wired — claim, unclaim, mark complete, PIN reset all fire correctly
- `maxDuration = 60` set on all routes that call Twilio
- Notification log — every SMS attempt recorded with chore reference, timestamp, delivery status
- Error handling — failed SMS does not break the underlying action

**Done when:** All trigger points fire SMS reliably. Every attempt appears in the notification log. A Twilio failure does not block chore state transitions.

---

## Milestone 7 — Earnings

**Goal:** Balance is visible, accurate, and clearable.

**Deliverables:**
- Derived balance — calculated at runtime by summing Approved + `paid = false` chores
- Balance visible on child view — current unpaid balance displayed prominently
- Balance visible on parent view — same figure, always in sync
- Pay modal — parent taps balance → "Pay $X?" → [Yes | No]
- Pay confirmation — all Approved + unpaid chores flip `paid = true`, balance recalculates to zero
- Paid chores — drop off child's active view after payment

**Done when:** Balance is accurate across all states. Pay flow clears balance on both views. Paid chores no longer appear in child's active list.

---

## Milestone 8 — Proposals

**Goal:** Child can propose chores. Parent can accept, counter, or reject.

**Deliverables:**
- Propose — child submits name + asking reward, proposal enters Proposed state
- Proposals inbox — parent sees all pending proposals
- Accept at ask — proposal becomes a chore at asking price, enters Available
- Counter — parent sets lower amount, proposal becomes a chore at counter price, enters Available
- Reject — proposal rejected, enters Rejected state
- Child acknowledgment — child must acknowledge a rejection before it can be deleted
- Parent delete — parent can delete a rejected + acknowledged proposal
- SMS on proposal — parent notified when child submits a proposal

**Done when:** Full proposal loop works in all three paths (accept, counter, reject). Rejected proposals require child acknowledgment before deletion.

---

## Build Order Summary

| Milestone | Depends On |
|---|---|
| 1 — Foundation | Nothing |
| 2 — Parent Access | 1 |
| 3 — Chore Management | 2 |
| 4 — Child Experience | 3 |
| 5 — Approvals | 4 |
| 6 — SMS | 4 |
| 7 — Earnings | 5 |
| 8 — Proposals | 3, 6 |

---

## Final Success Criteria

- [ ] ChoreTracker deployed to Vercel
- [ ] Child successfully claims a chore
- [ ] Child marks a chore complete
- [ ] Parent receives SMS notification
- [ ] Parent approves a completed chore
- [ ] Parent rejects a completed chore with a comment
- [ ] Child sees rejection comment and resubmits
- [ ] Parent pays balance — clears on both views
- [ ] Child proposes a chore — parent accepts, counters, and rejects one each

