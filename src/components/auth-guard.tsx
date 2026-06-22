"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth/auth-context";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Wraps protected page content.
 * While the session is loading shows a spinner.
 * If no session exists, immediately triggers the IdP redirect — no /login
 * intermediate page is shown to the user.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading, authError, signIn } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !authError) {
      // Preserve the full URL (pathname + query) so the callback page can restore it.
      // Strip the base path prefix — router.replace() is base-path-aware and
      // would produce a double prefix (e.g. /myapp/myapp/quotes) if we kept it.
      const base = '/api/custom-ui/philips';
      const fullPath = window.location.pathname + window.location.search;
      const redirectPath =
        base && fullPath.startsWith(base)
          ? fullPath.slice(base.length) || "/"
          : fullPath;
      sessionStorage.setItem("auth.redirect", redirectPath);
      signIn();
    }
  }, [isLoading, isAuthenticated, authError, signIn]);

  if (authError) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-4" role="alert">
        <p className="text-destructive text-sm">Sign-in failed: {authError.message}</p>
        <button onClick={signIn} className="text-sm underline text-muted-foreground hover:text-foreground">
          Try again
        </button>
      </div>
    );
  }

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center" role="status" aria-live="polite">
        <div className="text-muted-foreground text-sm animate-pulse">
          Redirecting to sign-in…
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
