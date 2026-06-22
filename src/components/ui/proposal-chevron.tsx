"use client";

import type { Proposal, LifecycleStagesData } from "@/lib/api";
import { StageChevron } from "@/components/ui/stage-chevron";

interface ProposalChevronProps {
  proposal: Proposal;
  /**
   * Raw API response from `getLifecycleStages`.
   * Undefined while the API call is still in flight — triggers the skeleton.
   */
  stages?: LifecycleStagesData[];
  className?: string;
}

/**
 * Proposal-specific chevron progress bar.
 *
 * Derives the ordered stage list from the first workflow in the
 * `LifecycleStagesData[]` response (single quote → single workflow),
 * sorts by `SequenceNumber`, and displays `StageDisplayName` labels.
 *
 * The active stage is matched against `proposal.ApprovalStage`.
 */
export function ProposalChevron({ proposal, stages, className }: ProposalChevronProps) {
  const stageLabels = [...(stages?.[0]?.Stages ?? [])]
    .sort((a, b) => a.SequenceNumber - b.SequenceNumber)
    .map((s) => s.StageDisplayName ?? s.StageName ?? "")
    .filter((s): s is string => s.length > 0);

  return (
    <StageChevron
      stages={stageLabels}
      currentStage={proposal.ApprovalStage ?? ""}
      loading={stages === undefined}
      className={className}
    />
  );
}
