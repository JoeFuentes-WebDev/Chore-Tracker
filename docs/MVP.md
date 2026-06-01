# MVP.md
## ChoreTracker — V1 Scope

---

### What V1 Is

The smallest version of ChoreTracker that a real family can use end-to-end. One parent. One child. Real chores. Real dollars tracked. SMS notification when work is done.

### In Scope

**Parent experience**
- Create, edit, and delete chores
- Set a dollar reward per chore
- Receive SMS when a chore is marked complete
- Approve completed chores (triggers payout)
- Reject completed chores with a comment (sends chore back to In Progress)
- View earnings owed per child
- Accept or counter a child's chore proposal

**Child experience**
- View available chores and their rewards
- Claim a chore
- Mark a chore complete
- View status of claimed chores
- Propose a new chore with a name and asking reward
- See parent's counter-offer on a proposal
- Track total earnings approved

**Notifications**
- Parent receives one SMS when a chore is marked complete by the child

**Infrastructure**
- Deployed to Vercel
- Mobile-first PWA
- No app store, no subscriptions

### Out of Scope for V1

- Multiple children in the UI (data model supports it, UI does not)
- Recurring chores
- SMS two-way reply (approve/reject via text)
- Push notifications
- Earnings history or export
- Chore categories or tags
- Photo proof of completion
- Multiple counter-offers on proposals

### Deferred, Not Deleted

Multi-child UI, points/Robux currency types, photo proof, recurring chores — these are sequenced after V1 ships, not abandoned.

