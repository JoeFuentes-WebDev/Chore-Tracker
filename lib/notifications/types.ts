import type { NotificationEvent } from "@/lib/constants/statuses";

export interface SendNotificationInput {
  recipientUserId: string;
  event: NotificationEvent;
  title: string;
  body: string;
  url?: string;
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
}
