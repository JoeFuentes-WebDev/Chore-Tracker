import type { ReactNode } from "react";

interface JoinFamilyLayoutProps {
  title: string;
  children: ReactNode;
}

export function JoinFamilyLayout({ title, children }: JoinFamilyLayoutProps) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center gap-6 px-4 py-8">
      <h1 className="text-center text-2xl font-semibold">{title}</h1>
      {children}
    </main>
  );
}
