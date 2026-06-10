import type { ChoreStatus } from "@/lib/constants/statuses";

/** Serializable chore row for the parent manage-tab library. */
export interface FamilyChoreLibraryItem {
  id: string;
  name: string;
  description: string | null;
  reward: number;
  status: ChoreStatus;
  paid: boolean;
}
