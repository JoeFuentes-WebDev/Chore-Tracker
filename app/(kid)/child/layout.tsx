import type { ReactNode } from "react";

interface ChildLayoutProps {
  children: ReactNode;
}

export default function ChildLayout({ children }: ChildLayoutProps) {
  return children;
}
