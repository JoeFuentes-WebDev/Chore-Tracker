import type { ChoreStatus } from "@prisma/client";

/** Serializable chore shape passed from Server Components to the kid board. */
export interface KidBoardChore {
  id: string;
  name: string;
  description: string | null;
  reward: number;
  status: ChoreStatus;
}

export interface KidBoardData {
  earningsTotal: number;
  availableChores: KidBoardChore[];
  activeChores: KidBoardChore[];
}
