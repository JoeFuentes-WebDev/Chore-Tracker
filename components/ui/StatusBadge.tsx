import {
  ChoreStatus as ChoreStatusValues,
  type ChoreStatus,
  type ProposalStatus,
} from "@/lib/constants/statuses";
import { CHORE_STATUS_LABELS, PROPOSAL_STATUS_LABELS } from "@/lib/status-labels";
import { cn } from "@/lib/utils";

const statusBadgeClassName = cn(
  "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
  "bg-muted text-muted-foreground",
);

const approvedUnpaidBadgeClassName = cn(
  "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
  "bg-amber-100 text-amber-800",
);

const paidBadgeClassName = cn(
  "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
  "bg-green-100 text-green-800",
);

export type StatusBadgeProps =
  | { type: "chore"; status: ChoreStatus; paid?: boolean; className?: string }
  | { type: "proposal"; status: ProposalStatus; className?: string }
  | { label: string; className?: string };

function resolveChoreBadge(
  status: ChoreStatus,
  paid: boolean | undefined,
): { label: string; className: string } {
  if (status === ChoreStatusValues.APPROVED) {
    if (paid) {
      return { label: "Paid", className: paidBadgeClassName };
    }

    return { label: "Approved", className: approvedUnpaidBadgeClassName };
  }

  return {
    label: CHORE_STATUS_LABELS[status],
    className: statusBadgeClassName,
  };
}

function resolveLabel(props: StatusBadgeProps): string {
  if ("label" in props) {
    return props.label;
  }

  if (props.type === "chore") {
    return resolveChoreBadge(props.status, props.paid).label;
  }

  return PROPOSAL_STATUS_LABELS[props.status];
}

function resolveClassName(props: StatusBadgeProps): string {
  const customClassName = "className" in props ? props.className : undefined;

  if ("label" in props) {
    return cn(statusBadgeClassName, customClassName);
  }

  if (props.type === "chore") {
    return cn(resolveChoreBadge(props.status, props.paid).className, customClassName);
  }

  return cn(statusBadgeClassName, customClassName);
}

export function StatusBadge(props: StatusBadgeProps) {
  const label = resolveLabel(props);
  const className = resolveClassName(props);

  return <span className={className}>{label}</span>;
}
