import { ChoreStatus } from "@prisma/client";
import { afterEach, describe, expect, it } from "vitest";

import { approveChoreById } from "@/lib/approve-chore";
import { claimChoreForChild } from "@/lib/claim-chore";
import { finishChoreForChild } from "@/lib/finish-chore";
import { rejectChoreById } from "@/lib/reject-chore";
import { startChoreForChild } from "@/lib/start-chore";
import { prisma } from "@/lib/prisma";

import {
  createAvailableChore,
  createTestBundle,
  createTestChildMember,
  createTestFamily,
  createTestParentMember,
  setChoreStatus,
  teardownTestBundle,
  trackFamily,
  trackUser,
} from "../helpers/fixtures";

const describeWithDb = describe.skipIf(!process.env.DATABASE_URL);

describeWithDb("chore state machine and family scoping", () => {
  const bundle = createTestBundle();

  afterEach(async () => {
    await teardownTestBundle(bundle);
    bundle.familyIds.length = 0;
    bundle.userIds.length = 0;
  });

  it("runs claim → start → finish → approve for the assigned child", async () => {
    const familyId = await createTestFamily();
    trackFamily(bundle, familyId);
    await createTestParentMember(familyId);
    const child = await createTestChildMember(familyId);
    trackUser(bundle, child);
    const choreId = await createAvailableChore(familyId);

    expect(await claimChoreForChild(choreId, child.id, { familyId })).toEqual({
      ok: true,
    });
    expect(await startChoreForChild(choreId, child.id, { familyId })).toEqual({
      ok: true,
    });
    expect(await finishChoreForChild(choreId, child.id, { familyId })).toEqual({
      ok: true,
    });
    expect(await approveChoreById(choreId, { familyId })).toEqual({ ok: true });

    const chore = await prisma.chore.findUniqueOrThrow({ where: { id: choreId } });
    expect(chore.status).toBe(ChoreStatus.APPROVED);
    expect(chore.assignedUserId).toBe(child.id);
  });

  it("returns a child from pending approval to in progress on reject", async () => {
    const familyId = await createTestFamily();
    trackFamily(bundle, familyId);
    await createTestParentMember(familyId);
    const child = await createTestChildMember(familyId);
    trackUser(bundle, child);
    const choreId = await createAvailableChore(familyId);

    await claimChoreForChild(choreId, child.id, { familyId });
    await startChoreForChild(choreId, child.id, { familyId });
    await finishChoreForChild(choreId, child.id, { familyId });

    expect(await rejectChoreById(choreId, { familyId })).toEqual({ ok: true });

    const chore = await prisma.chore.findUniqueOrThrow({ where: { id: choreId } });
    expect(chore.status).toBe(ChoreStatus.IN_PROGRESS);
  });

  it("blocks cross-family mutations", async () => {
    const familyA = await createTestFamily("Family A");
    const familyB = await createTestFamily("Family B");
    trackFamily(bundle, familyA);
    trackFamily(bundle, familyB);
    const childB = await createTestChildMember(familyB);
    trackUser(bundle, childB);
    const choreId = await createAvailableChore(familyA);

    const result = await claimChoreForChild(choreId, childB.id, { familyId: familyB });
    expect(result).toEqual({
      ok: false,
      error: "This chore is no longer available.",
    });
  });

  it("rejects invalid status transitions", async () => {
    const familyId = await createTestFamily();
    trackFamily(bundle, familyId);
    await createTestParentMember(familyId);
    const child = await createTestChildMember(familyId);
    trackUser(bundle, child);
    const choreId = await createAvailableChore(familyId);

    expect(await approveChoreById(choreId, { familyId })).toEqual({
      ok: false,
      error: "This chore cannot be approved.",
    });

    await setChoreStatus(choreId, ChoreStatus.CLAIMED, child.id);
    expect(await finishChoreForChild(choreId, child.id, { familyId })).toEqual({
      ok: false,
      error: "This chore cannot be submitted for approval.",
    });
  });
});
