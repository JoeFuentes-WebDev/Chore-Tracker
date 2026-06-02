/** Serializable pending-approval chore for the parent dashboard. */
export interface ParentPendingChore {
  id: string;
  name: string;
  description: string | null;
  reward: number;
  childName: string;
  submittedAt: string;
}

export interface ParentDashboardData {
  pendingChores: ParentPendingChore[];
}
