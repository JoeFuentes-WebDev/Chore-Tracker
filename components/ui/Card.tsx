import type { HTMLAttributes, LiHTMLAttributes, ReactNode } from "react";

import { formatReward } from "@/lib/utils";
import { cn } from "@/lib/utils";

const cardClassName = "rounded-xl border border-border bg-card p-4";

export function Card({
  className,
  children,
  ...props
}: LiHTMLAttributes<HTMLLIElement> & { children: ReactNode }) {
  return (
    <li className={cn(cardClassName, className)} {...props}>
      {children}
    </li>
  );
}

export function CardSection({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLElement> & { children: ReactNode }) {
  return (
    <section className={cn(cardClassName, className)} {...props}>
      {children}
    </section>
  );
}

export function CardHeader({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-3", className)}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("min-w-0 flex-1", className)}>{children}</div>;
}

export function CardContent({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("mt-3", className)}>{children}</div>;
}

export function CardFooter({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("mt-3 flex gap-3", className)}>{children}</div>;
}

export function RewardPill({ amount }: { amount: number }) {
  return (
    <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-sm font-medium tabular-nums">
      {formatReward(amount)}
    </span>
  );
}
