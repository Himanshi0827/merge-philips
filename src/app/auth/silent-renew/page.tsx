"use client";

import { useEffect } from "react";
import { getUserManager } from "@/lib/auth/oidc-config";

/**
 * Hidden iframe target for silent token renewal.
 * oidc-client-ts loads this page in a hidden iframe when the access
 * token is close to expiry, processes the new tokens, and closes the
 * iframe automatically. This page should render nothing visible.
 */
export default function SilentRenewPage() {
  useEffect(() => {
    getUserManager().signinSilentCallback().catch(console.error);
  }, []);

  return null;
}
