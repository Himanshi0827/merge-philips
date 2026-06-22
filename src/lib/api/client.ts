import axios from 'axios';
import type { AxiosError } from 'axios';

/**
 * Returns an access token using legacy and oidc-client-ts storage formats.
 * This keeps older merged service modules working during auth migration.
 */
export function getAccessToken(): string {
  if (typeof window === 'undefined') return '';

  // Legacy callback bridge format used by older code paths.
  const legacyUser = sessionStorage.getItem('user');
  if (legacyUser) {
    try {
      const parsed = JSON.parse(legacyUser) as { access_token?: string };
      if (parsed?.access_token) return parsed.access_token;
    } catch {
      // Ignore malformed legacy storage and continue fallback lookup.
    }
  }

  // oidc-client-ts persists current user under keys ending in "user:<authority>:<client_id>".
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key || !key.includes('user:')) continue;

    const raw = localStorage.getItem(key);
    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw) as { access_token?: string };
      if (parsed?.access_token) return parsed.access_token;
    } catch {
      // Ignore malformed values and continue searching.
    }
  }

  return '';
}

/**
 * Creates a per-call axios instance pre-configured with a Bearer token header.
 * An error-normalizing interceptor is attached so all HTTP errors surface as
 * plain Error objects with a consistent "[status] message" format.
 *
 * A fresh instance is returned on every call to avoid mutating shared state.
 */
export function clientWithToken(token: string) {
  const congaBaseUrl = 'https://preview-rls09.congacloud.com';
  if (!congaBaseUrl) {
    throw new Error("NEXT_PUBLIC_CONGA_API_BASE_URL is not configured");
  }

  const client = axios.create({
    baseURL: congaBaseUrl,
    timeout: 30_000,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const status = error.response?.status ?? 'unknown';
      const data = error.response?.data as
        | { Errors?: Array<{ Message: string }> }
        | undefined;
      const message = data?.Errors?.[0]?.Message ?? error.message;
      return Promise.reject(new Error(`[${status}] ${message}`));
    },
  );

  return client;
}
