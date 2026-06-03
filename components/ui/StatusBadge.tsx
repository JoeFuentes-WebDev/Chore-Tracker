import type { ChoreStatus, ProposalStatus } from "@prisma/client";

import { CHORE_STATUS_LABELS, PROPOSAL_STATUS_LABELS } from "@/lib/status-labels";
import { cn } from "@/lib/utils";

const statusBadgeClassName = cn(
  "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
  "bg-muted text-muted-foreground",
);

export type StatusBadgeProps =
  | { type: "chore"; status: ChoreStatus; className?: string }
  | { type: "proposal"; status: ProposalStatus; className?: string }
  | { label: string; className?: string };

function resolveLabel(props: StatusBadgeProps): string {
  if ("label" in props) {
    return props.label;
  }

  if (props.type === "chore") {
    return CHORE_STATUS_LABELS[props.status];
  }

  return PROPOSAL_STATUS_LABELS[props.status];
}

export function StatusBadge(props: StatusBadgeProps) {
  const label = resolveLabel(props);
  const className = "className" in props ? props.className : undefined;

  return <span className={cn(statusBadgeClassName, className)}>{label}</span>;
}
