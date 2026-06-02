import type { ProposalStatus } from "@prisma/client";

/** Serializable proposal shape passed from Server Components to the kid board. */
export interface KidProposal {
  id: string;
  name: string;
  askingReward: number;
  status: ProposalStatus;
  createdAt: string;
}

export interface KidProposalsData {
  proposals: KidProposal[];
}
