import type { ReactNode } from "react";

import { DemoBanner } from "@/components/layout/DemoBanner";
import { PushSubscribeRegistrar } from "@/components/shared/PushSubscribeRegistrar";

interface KidBoardLayoutProps {
  children: ReactNode;
}

export async function KidBoardLayout({ children }: KidBoardLayoutProps) {
  return (
    <main className="mx-auto flex max-w-lg flex-col gap-6 px-4 pb-20 pt-6">
      <DemoBanner />
      <PushSubscribeRegistrar />
      {children}
    </main>
  );
}
