import { DemoStartOverButton } from "@/components/demo/DemoSessionStarter";
import { isDemoActive } from "@/lib/demo/is-demo-active";
import { cn } from "@/lib/utils";

export async function DemoBanner() {
  if (!(await isDemoActive())) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg border border-border",
        "bg-muted/50 px-3 py-2 text-sm",
      )}
    >
      <p className="text-muted-foreground">You&apos;re in demo mode</p>
      <DemoStartOverButton />
    </div>
  );
}
