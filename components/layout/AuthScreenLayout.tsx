import type { ReactNode } from "react";

interface AuthScreenLayoutProps {
  title: string;
  children: ReactNode;
}

export function AuthScreenLayout({ title, children }: AuthScreenLayoutProps) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-4 py-8">
      <h1 className="mb-6 text-center text-2xl font-semibold">{title}</h1>
      <div className="flex justify-center">{children}</div>
    </main>
  );
}
