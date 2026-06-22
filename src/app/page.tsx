"use client";

import Link from "next/link";
import { AuthGuard } from "@/components/auth-guard";
import { Button } from "@conga-cloud/design-system";

export default function Home() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Conga CPQ</h1>
          <p className="mt-2 text-muted-foreground">Manage your quotes and proposals</p>
        </div>
        <Button asChild>
          <Link href="/quotes">View Quotes</Link>
        </Button>
      </div>
    </AuthGuard>
  );
}
