import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/** Legacy entry — demo init now runs via Server Action on /demo. */
export async function GET() {
  redirect("/demo");
}
