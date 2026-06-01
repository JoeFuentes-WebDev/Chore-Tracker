# UserStories.md
## ChoreTracker — V1

---

## Parent Stories

**Chore Management**
- As a parent, I want to create a chore with a name, description, and dollar reward so my child knows what to do and what they'll earn.
- As a parent, I want to edit an existing chore so I can adjust the reward or clarify the description.
- As a parent, I want to delete a chore so it no longer appears on the board.

**Approval Flow**
- As a parent, I want to receive an SMS when my child marks a chore complete so I know to review it.
- As a parent, I want to approve a completed chore so my child's earnings are updated.
- As a parent, I want to reject a completed chore with a comment so my child knows what needs to be fixed.

**Proposals**
- As a parent, I want to see chores my child has proposed so I can decide whether to add them.
- As a parent, I want to accept a proposed chore at the child's asking price so it appears on the board.
- As a parent, I want to counter a proposed chore with a lower reward so we can negotiate.

**Earnings**
- As a parent, I want to see the total amount I owe my child so I know what to pay them.

---

## Child Stories

**Chore Board**
- As a child, I want to see all available chores and their rewards so I can decide what to work on.
- As a child, I want to claim a chore so others know I'm working on it and it's mine.

**Completion Flow**
- As a child, I want to mark a chore complete so my parent gets notified to review my work.
- As a child, I want to see my parent's rejection comment so I know what to fix.
- As a child, I want to see when my completed chore is approved so I know I earned the reward.

**Proposals**
- As a child, I want to propose a new chore with a name and a reward I think is fair.
- As a child, I want to see if my parent accepted or countered my proposal.
- As a child, I want to claim a countered chore if I agree the lower reward is worth it.

**Earnings**
- As a child, I want to see my total approved earnings so I know how much I've made.

---

## Chore State Machine

```
Available
   ↓ child claims
Claimed
   ↓ child starts working
In Progress
   ↓ child marks complete
Pending Approval
   ↓ parent approves       ↓ parent rejects (with comment)
Approved              In Progress (comment visible to child)
```

---

## Proposal State Machine

```
Proposed (child: name + asking reward)
   ↓ parent accepts at ask    ↓ parent counters (lower reward)
Available (at ask)         Available (at counter amount)
                              ↓ child claims = implicit acceptance
                           Claimed
```

