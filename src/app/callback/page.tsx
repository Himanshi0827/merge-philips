// @ts-nocheck
'use client';

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getUserManager } from "@/lib/auth/oidc-config";

export default function CallbackPage() {
  const router = useRouter();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    getUserManager()
      .signinRedirectCallback()
      .then((user) => {
        // Bridge: write to sessionStorage["user"] so M2ITEST3-style getAccessToken() also works
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

  return <p>Signing you in…</p>;
}
