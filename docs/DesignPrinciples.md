# DesignPrinciples.md
## ChoreTracker — V1

---

## 1. Mobile-First

All layouts, tap targets, and interactions are designed for a phone screen first. Desktop is secondary and should not break but is not the primary target.

## 2. Child-Friendly

V1: Clean, simple, uncluttered UI appropriate for a pre-teen. No age-specific design treatment yet.

V2: On setup, a child's age is recorded. UI adapts to age group — design TBD.

## 3. Minimal Friction

Every core action — claim a chore, mark complete, approve, reject — should be reachable in as few taps as possible. No confirmation dialogs except for destructive or financial actions (Pay modal).

## 4. Parent Control

The parent view is the source of truth. Parent creates, approves, rejects, pays, and manages the roster. The child view is read-mostly with limited write actions (claim, complete, propose).

## 5. Visible Progress

V1: Current unpaid balance is visible to both parent and child at all times.

V2: Child can set an earnings target. Progress is displayed as `Target: $100 — $25 more to go`.

