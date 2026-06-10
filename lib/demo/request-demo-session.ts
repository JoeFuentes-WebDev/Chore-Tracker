export type RequestDemoSessionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function requestDemoSession(): Promise<RequestDemoSessionResult> {
  const response = await fetch("/api/demo/session", {
    method: "POST",
    credentials: "same-origin",
  });

  let payload: { ok?: boolean; error?: string } = {};

  try {
    payload = (await response.json()) as { ok?: boolean; error?: string };
  } catch {
    payload = {};
  }

  if (!response.ok || !payload.ok) {
    return {
      ok: false,
      error: payload.error ?? "Could not start the demo.",
    };
  }

  return { ok: true };
}
