"use client";

import { ProposalReviewCard } from "@/components/parent/ProposalReviewCard";
import type { ParentReviewProposal } from "@/lib/parent-dashboard-types";

export interface ProposalReviewListProps {
  proposals: ParentReviewProposal[];
}

export function ProposalReviewList({ proposals }: ProposalReviewListProps) {
  return (
    <section aria-label="Proposal review">
      <h2 className="mb-3 text-lg font-semibold">Proposal review</h2>
      {proposals.length === 0 ? (
        <p className="text-sm text-muted-foreground">No proposals yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {proposals.map((proposal) => (
            <ProposalReviewCard key={proposal.id} proposal={proposal} />
          ))}
        </ul>
      )}
    </section>
  );
}
