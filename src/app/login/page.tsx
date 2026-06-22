"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * This page exists solely as the OIDC post_logout_redirect_uri target
 * and as a fallback for direct navigation to /login.
 * It immediately triggers the IdP redirect — no login button is shown.
 */
export default function LoginPage() {
  const { isAuthenticated, isLoading, signIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      router.replace("/");
      return;
    }
    // Immediately redirect to the external IdP
    signIn();
  }, [isLoading, isAuthenticated, router, signIn]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground text-sm animate-pulse">
        Redirecting to sign-in…
      </p>
    </div>
  );
}
