import type { ReactNode } from "react";

import { PushSubscribeRegistrar } from "@/components/shared/PushSubscribeRegistrar";

interface KidBoardLayoutProps {
  children: ReactNode;
}

export function KidBoardLayout({ children }: KidBoardLayoutProps) {
  return (
    <main className="mx-auto flex max-w-lg flex-col gap-6 px-4 pb-20 pt-6">
      <PushSubscribeRegistrar />
      {children}
    </main>
  );
}
