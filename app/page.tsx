import Link from "next/link";

import { Button } from "@/components/ui/Button";
import {
  getParentSignInPath,
  getParentSignUpPath,
} from "@/lib/auth/parent-auth-paths";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center gap-8 px-4 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-semibold">Chore Tracker</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage chores and rewards for your family.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <Link href={getParentSignInPath()}>
          <Button className="w-full">Parent sign in</Button>
        </Link>
        <Link href={getParentSignUpPath()}>
          <Button variant="secondary" className="w-full">
            Create parent account
          </Button>
        </Link>
        <Link href="/board">
          <Button variant="ghost" className="w-full">
            Child board
          </Button>
        </Link>
        <Link href="/demo">
          <Button variant="ghost" className="w-full">
            Try demo
          </Button>
        </Link>
      </div>
    </main>
  );
}
