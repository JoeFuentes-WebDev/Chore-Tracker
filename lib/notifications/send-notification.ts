import { sendPushToUser } from "@/lib/notifications/send-push";
import type { SendNotificationInput } from "@/lib/notifications/types";

/**
 * Single notification entry point. M8 implements Web Push only.
 * Future channels (SMS, email) plug in here without changing callers.
 */
export async function sendNotification(input: SendNotificationInput): Promise<void> {
  try {
    await sendPushToUser(input.recipientUserId, {
      title: input.title,
      body: input.body,
      url: input.url,
    });
  } catch {
    // Fire-and-forget — delivery failure must not propagate.
  }
}

/** Notify multiple recipients without throwing. */
export async function sendNotificationToMany(
  recipientUserIds: string[],
  buildInput: (recipientUserId: string) => Omit<SendNotificationInput, "recipientUserId">,
): Promise<void> {
  const uniqueIds = [...new Set(recipientUserIds)];

  await Promise.all(
    uniqueIds.map((recipientUserId) =>
      sendNotification({ recipientUserId, ...buildInput(recipientUserId) }),
    ),
  );
}
