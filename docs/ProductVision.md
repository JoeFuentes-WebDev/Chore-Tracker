# ProductVision.md
## ChoreTracker

---

### Problem

Parents want to teach kids responsibility and the value of money through chores. Existing apps are overbuilt, subscription-based, or require app store installs. Most families abandon them within weeks.

### Product

A lightweight mobile-first PWA for families. No app store. No subscriptions. No bloat. Bookmark it and go.

The parent manages the chore board and sets rewards. Each child picks chores, does the work, and gets paid when the parent approves. Kids can also propose new chores and negotiate the reward.

### Users

**Parent** — creates and manages chores, sets reward amounts, approves or rejects completed work, receives SMS notifications, manages the family roster.

**Child** — sees available chores, claims and completes them, proposes new chores, tracks earnings.

### Family Scale

The product is designed for families with multiple children of varying ages. V1 supports one parent and one child. Multi-child support is a near-term requirement — the data model supports it from day one.

### Rewards

V1 rewards are denominated in dollars. The reward model is abstracted (`amount` + `currency_type`) so future versions can support points, Robux, screen time, or any other currency without a schema rewrite.

### Success

- A child completes a chore and gets paid without a parent having to remember
- A parent can see exactly what's been done, what's pending, and what's owed
- A family uses it consistently because it's simple enough to not get in the way

### Out of Scope

- Recurring chore schedules
- Multiple parents or guardians
- In-app payments (rewards are tracked, not transferred)
- Push notifications (SMS only for V1)
- Native mobile app

