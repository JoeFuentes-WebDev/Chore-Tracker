import { getDemoContext } from "@/lib/demo/get-demo-context";

/** True when the browser has a valid demo session cookie and family. */
export async function isDemoActive(): Promise<boolean> {
  const demo = await getDemoContext();
  return demo.kind === "active";
}
