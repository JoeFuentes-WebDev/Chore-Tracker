import Link from "next/link";

import { DemoSessionStarter } from "@/components/demo/DemoSessionStarter";
import { buttonVariants } from "@/components/ui/Button";
import { getChildBoardPath } from "@/lib/auth/child-auth-paths";
import { getParentDashboardPath } from "@/lib/auth/parent-auth-paths";
import { getDemoContext } from "@/lib/demo/get-demo-context";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DemoPage() {
  const demo = await getDemoContext();

  if (demo.kind !== "active") {
    return <DemoSessionStarter />;
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center gap-8 px-4 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-semibold">Try Chore Tracker</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Explore a pre-loaded demo family. Changes reset nightly.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <Link
          href={getParentDashboardPath()}
          className={cn(buttonVariants({ variant: "primary" }), "w-full")}
        >
          I&apos;m the Parent
        </Link>
        <Link
          href={getChildBoardPath()}
          className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
        >
          I&apos;m the Child
        </Link>
      </div>
    </main>
  );
}
