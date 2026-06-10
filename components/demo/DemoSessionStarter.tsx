"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { startDemoOver } from "@/app/demo/actions";
import { requestDemoSession } from "@/lib/demo/request-demo-session";
import { Button } from "@/components/ui/Button";

const DEMO_INIT_ATTEMPTS_KEY = "choretracker_demo_init_attempts";
const DEMO_INIT_FAILED_KEY = "choretracker_demo_init_failed";
const MAX_DEMO_INIT_ATTEMPTS = 2;

function readStoredInitError(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return sessionStorage.getItem(DEMO_INIT_FAILED_KEY);
}

function clearDemoInitStorage(): void {
  sessionStorage.removeItem(DEMO_INIT_ATTEMPTS_KEY);
  sessionStorage.removeItem(DEMO_INIT_FAILED_KEY);
}

function markDemoInitFailed(message: string): void {
  sessionStorage.setItem(DEMO_INIT_FAILED_KEY, message);
}

function incrementDemoInitAttempts(): number {
  const attempts = Number(sessionStorage.getItem(DEMO_INIT_ATTEMPTS_KEY) ?? "0") + 1;
  sessionStorage.setItem(DEMO_INIT_ATTEMPTS_KEY, String(attempts));
  return attempts;
}

/** Clears one-shot init guards after a successful demo session. */
export function DemoSessionCleanup() {
  useEffect(() => {
    clearDemoInitStorage();
  }, []);

  return null;
}

export function DemoSessionStarter() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const hasAutoStartedRef = useRef(false);

  function runInitialize() {
    setError(null);

    startTransition(async () => {
      const result = await requestDemoSession();

      if (!result.ok) {
        markDemoInitFailed(result.error);
        setError(result.error);
        return;
      }

      const attempts = incrementDemoInitAttempts();

      if (attempts > MAX_DEMO_INIT_ATTEMPTS) {
        const message =
          "Demo session could not start in this browser. Try a private window or another browser.";
        markDemoInitFailed(message);
        setError(message);
        return;
      }

      window.location.assign("/demo");
    });
  }

  function handleRetryClick() {
    clearDemoInitStorage();
    runInitialize();
  }

  useEffect(() => {
    const storedError = readStoredInitError();

    if (storedError) {
      setError(storedError);
      return;
    }

    if (hasAutoStartedRef.current) {
      return;
    }

    hasAutoStartedRef.current = true;
    runInitialize();
  }, []);

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center gap-4 px-4 py-8">
      {error ? (
        <>
          <p className="text-center text-sm text-destructive" role="alert">
            {error}
          </p>
          <Button
            type="button"
            variant="primary"
            className="w-full"
            disabled={isPending}
            onClick={handleRetryClick}
          >
            {isPending ? "Retrying…" : "Try again"}
          </Button>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          {isPending ? "Preparing your demo…" : "Starting demo…"}
        </p>
      )}
    </main>
  );
}

export function DemoStartOverButton() {
  const [isPending, startTransition] = useTransition();

  function handleStartOverClick() {
    startTransition(async () => {
      clearDemoInitStorage();
      await startDemoOver();
      window.location.assign("/demo");
    });
  }

  return (
    <button
      type="button"
      onClick={handleStartOverClick}
      disabled={isPending}
      className="font-medium text-foreground underline-offset-4 hover:underline disabled:opacity-50"
    >
      Start over
    </button>
  );
}
