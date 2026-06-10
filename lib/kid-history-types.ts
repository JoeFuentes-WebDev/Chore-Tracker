/** Serializable approved chore for the kid history tab. */
export interface KidHistoryChore {
  id: string;
  name: string;
  description: string | null;
  reward: number;
  paid: boolean;
  completedAt: string;
}

export interface KidHistoryData {
  historyChores: KidHistoryChore[];
  lifetimeEarningsTotal: number;
}
