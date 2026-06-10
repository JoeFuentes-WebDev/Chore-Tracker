"use client";

import { useEffect, useRef } from "react";

import { initializeDemoSession } from "@/app/demo/actions";

export function DemoSessionStarter() {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    formRef.current?.requestSubmit();
  }, []);

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center gap-4 px-4 py-8">
      <p className="text-sm text-muted-foreground">Preparing your demo…</p>
      <form ref={formRef} action={initializeDemoSession}>
        <button type="submit" className="sr-only">
          Start demo
        </button>
      </form>
    </main>
  );
}
