export const maxDuration = 60;

import { NextResponse } from "next/server";

import { getNotificationSessionUser } from "@/lib/auth/get-notification-session-user";
import { isWebPushConfigured } from "@/lib/push/configure-web-push";
import { prisma } from "@/lib/prisma";

interface PushSubscribeBody {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

function isValidSubscribeBody(body: unknown): body is PushSubscribeBody {
  if (typeof body !== "object" || body === null) {
    return false;
  }

  const candidate = body as Partial<PushSubscribeBody>;
  return (
    typeof candidate.endpoint === "string" &&
    candidate.endpoint.length > 0 &&
    typeof candidate.keys?.p256dh === "string" &&
    candidate.keys.p256dh.length > 0 &&
    typeof candidate.keys.auth === "string" &&
    candidate.keys.auth.length > 0
  );
}

/** Persist a Web Push subscription for the current session user. */
export async function POST(request: Request) {
  if (!isWebPushConfigured()) {
    return NextResponse.json({ ok: false, error: "Push not configured." }, { status: 503 });
  }

  const user = await getNotificationSessionUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in to enable notifications." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (!isValidSubscribeBody(body)) {
    return NextResponse.json({ ok: false, error: "Invalid subscription." }, { status: 400 });
  }

  await prisma.pushSubscription.upsert({
    where: { endpoint: body.endpoint },
    create: {
      userId: user.id,
      endpoint: body.endpoint,
      p256dh: body.keys.p256dh,
      auth: body.keys.auth,
    },
    update: {
      userId: user.id,
      p256dh: body.keys.p256dh,
      auth: body.keys.auth,
    },
  });

  return NextResponse.json({ ok: true });
}
