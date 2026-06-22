"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { User } from "oidc-client-ts";
import { getUserManager } from "./oidc-config";

interface AuthContextValue {
  /** The authenticated OIDC user, or null when not signed in. */
  user: User | null;
  /** True while the initial session check is in progress. */
  isLoading: boolean;
  /** Convenience flag. */
  isAuthenticated: boolean;
  /** Redirect to the IdP sign-in page. */
  signIn: () => Promise<void>;
  /** End the session and redirect to the IdP logout endpoint. */
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mgr = getUserManager();

    // Load any existing session from sessionStorage on mount
    mgr.getUser().then((u) => {
      setUser(u && !u.expired ? u : null);
      setIsLoading(false);
    });

    // Keep state in sync with UserManager events
    const onUserLoaded = (u: User) => setUser(u);
    const onUserUnloaded = () => setUser(null);
    const onSilentRenewError = () => setUser(null);

    mgr.events.addUserLoaded(onUserLoaded);
    mgr.events.addUserUnloaded(onUserUnloaded);
    mgr.events.addSilentRenewError(onSilentRenewError);
    mgr.events.addAccessTokenExpired(onUserUnloaded);

    return () => {
      mgr.events.removeUserLoaded(onUserLoaded);
      mgr.events.removeUserUnloaded(onUserUnloaded);
      mgr.events.removeSilentRenewError(onSilentRenewError);
      mgr.events.removeAccessTokenExpired(onUserUnloaded);
    };
  }, []);

  const signIn = useCallback(async () => {
    // Remove stale oidc state entries before redirecting after config changes.
    if (typeof window !== "undefined") {
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i += 1) {
        const key = window.localStorage.key(i);
        if (!key) continue;
        if (key.startsWith("oidc.state.")) keysToRemove.push(key);
      }
      keysToRemove.forEach((k) => window.localStorage.removeItem(k));
    }
    await getUserManager().signinRedirect();
  }, []);

  const signOut = useCallback(async () => {
    await getUserManager().signoutRedirect();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/** Returns the auth context. Must be used inside <AuthProvider>. */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }
  return ctx;
}
