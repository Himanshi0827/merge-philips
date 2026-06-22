"use client";

import { AuthGuard } from "@/components/auth-guard";
import { ProposalList } from "@/components/ui/proposal-list";

export default function QuotesPage() {
  return (
    <AuthGuard>
      <ProposalList />
    </AuthGuard>
  );
}
