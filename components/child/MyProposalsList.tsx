"use client";

import { KidProposalCard } from "@/components/child/KidProposalCard";
import type { KidProposal } from "@/lib/kid-proposal-types";

export interface MyProposalsListProps {
  proposals: KidProposal[];
}

export function MyProposalsList({ proposals }: MyProposalsListProps) {
  return (
    <section aria-label="My proposals">
      <h2 className="mb-3 text-lg font-semibold">My proposals</h2>
      {proposals.length === 0 ? (
        <p className="text-sm text-muted-foreground">You have no proposals yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {proposals.map((proposal) => (
            <KidProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </ul>
      )}
    </section>
  );
}
