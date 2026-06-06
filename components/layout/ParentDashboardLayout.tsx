import type { ReactNode } from "react";

import { ParentAuthHeader } from "@/components/parent/ParentAuthHeader";

interface ParentDashboardLayoutProps {
  children: ReactNode;
}

export function ParentDashboardLayout({ children }: ParentDashboardLayoutProps) {
  return (
    <main className="mx-auto flex max-w-lg flex-col gap-6 px-4 pb-20 pt-6">
      <h1 className="text-2xl font-semibold">Review</h1>
      <ParentAuthHeader />
      {children}
    </main>
  );
}
