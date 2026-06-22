"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Bare /quote-details — redirects to home.
 * The canonical URL is /quote-details/{quoteId}.
 */
export default function QuoteDetailsIndex() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, [router]);
  return null;
}
