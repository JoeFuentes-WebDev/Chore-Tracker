"use client";

import { useEffect, useRef } from "react";

import { registerPushSubscription } from "@/lib/push/subscribe-client";

/** Best-effort push registration — no settings UI. */
export function PushSubscribeRegistrar() {
  const attemptedRef = useRef(false);

  useEffect(() => {
    if (attemptedRef.current) {
      return;
    }

    attemptedRef.current = true;

    void registerPushSubscription().catch(() => {
      // Permission denied or unsupported — silent.
    });
  }, []);

  return null;
}
