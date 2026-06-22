"use client";

import type { Proposal } from "@/lib/api";
import { PageMessages } from "@/components/ui/page-messages";
import type { MessageConfig } from "@/components/ui/page-messages";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PENDING_TASK_MESSAGE =
  "This quote has pending background job(s). Do not clone or make changes to this quote until all job(s) are completed. Please continue to refresh your web browser until this message disappears. The message will disappear once the job(s) are completed.";

const SOLD_TO_CHANGED_MESSAGE =
  "The contracts associated with the quote have been updated for the account linked.";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ProposalMessagesProps {
  proposal: Proposal;
  className?: string;
}

/**
 * Translates Proposal field values into visible alert banners.
 * Mirrors the three conditions from the Salesforce APTS_ProposalErrorPage VF component:
 *
 *   SF: APTS_Error_Message__c is not blank
 *   →   Error banner with the field value as the message body
 *
 *   SF: Apttus_QPConfig__IsTaskPending__c != false
 *   →   Warning banner with the pending background-jobs message
 *
 *   SF: APTS_Sold_To_Changed__c = true AND ApprovalStage = 'Draft'
 *   →   Info banner about account contract updates
 */
export function ProposalMessages({ proposal, className }: ProposalMessagesProps) {
  const messages: MessageConfig[] = [
    {
      key: "error-message",
      variant: "error",
      message: proposal.APTS_Error_Message_c ?? "",
      show: Boolean(proposal.APTS_Error_Message_c?.trim()),
    },
    {
      key: "task-pending",
      variant: "warning",
      message: PENDING_TASK_MESSAGE,
      show: proposal.IsTaskPending === true,
    },
    {
      key: "sold-to-changed",
      variant: "info",
      message: SOLD_TO_CHANGED_MESSAGE,
      show:
        proposal.APTS_Sold_To_Changed_c === true &&
        proposal.ApprovalStage === "Draft",
    },
  ];

  return <PageMessages messages={messages} className={className} />;
}
