"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getUserManager } from "@/lib/auth/oidc-config";

/**
 * Landing page for the OIDC redirect_uri.
 * The IdP redirects here with ?code=…&state=… after successful login.
 * oidc-client-ts validates the response, stores the tokens, then we
 * send the user to their intended destination.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    getUserManager()
      .signinRedirectCallback()
      .then((user) => {
        // Backward compatibility for merged legacy services reading sessionStorage["user"].
        sessionStorage.setItem("user", JSON.stringify(user));
        const redirect = sessionStorage.getItem("auth.redirect") ?? "/";
        sessionStorage.removeItem("auth.redirect");
        router.replace(redirect);
      })
      .catch((err) => {
        console.error("OIDC callback error:", err);
        router.replace("/login?error=callback_failed");
      });
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground text-sm animate-pulse">
        Completing sign-in…
      </p>
    </div>
  );
}
