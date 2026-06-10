import type { ReactNode } from "react";

import { DemoBanner } from "@/components/layout/DemoBanner";
import { ParentAuthHeader } from "@/components/parent/ParentAuthHeader";
import { PushSubscribeRegistrar } from "@/components/shared/PushSubscribeRegistrar";
import { isDemoActive } from "@/lib/demo/is-demo-active";

interface ParentDashboardLayoutProps {
  children: ReactNode;
}

export async function ParentDashboardLayout({ children }: ParentDashboardLayoutProps) {
  const demoActive = await isDemoActive();

  return (
    <main className="mx-auto flex max-w-lg flex-col gap-6 px-4 pb-20 pt-6">
      <DemoBanner />
      <PushSubscribeRegistrar />
      {demoActive ? null : <ParentAuthHeader />}
      {children}
    </main>
  );
}
