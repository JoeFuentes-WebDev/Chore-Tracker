import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names while resolving conflicts (shadcn convention). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// TODO: implement currency formatting helper for reward Decimals, e.g.
// formatReward(amount: number | string): string  ->  "$2.50"
