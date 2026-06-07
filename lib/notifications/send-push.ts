import webpush from "web-push";

import { ensureWebPushConfigured } from "@/lib/push/configure-web-push";
import type { PushPayload } from "@/lib/notifications/types";
import { prisma } from "@/lib/prisma";

function isStalePushError(error: unknown): boolean {
  if (typeof error !== "object" || error === null || !("statusCode" in error)) {
    return false;
  }

  const statusCode = (error as { statusCode: number }).statusCode;
  return statusCode === 404 || statusCode === 410;
}

/** Send push to all subscriptions for a user. Removes stale endpoints on 404/410. */
export async function sendPushToUser(
  userId: string,
  payload: PushPayload,
): Promise<void> {
  if (!ensureWebPushConfigured()) {
    return;
  }

  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId },
  });

  if (subscriptions.length === 0) {
    return;
  }

  const payloadJson = JSON.stringify(payload);

  for (const subscription of subscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth,
          },
        },
        payloadJson,
      );
    } catch (error) {
      if (isStalePushError(error)) {
        await prisma.pushSubscription.delete({
          where: { id: subscription.id },
        });
      }
    }
  }
}
