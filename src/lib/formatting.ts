/**
 * Org-aware formatting utilities.
 *
 * `buildOrgFormatConfig()` derives a formatting config from the OrganizationInfo
 * API response. All formatters accept an optional config and fall back to safe
 * browser defaults when it is not yet loaded (progressive enhancement).
 */
import type { OrganizationInfo } from "@/lib/api";

// ─── Config ───────────────────────────────────────────────────────────────────

export interface OrgFormatConfig {
  /** BCP 47 locale tag, e.g. "en-US". */
  locale: string;
  /** ISO 4217 currency code, e.g. "USD". */
  currency: string;
  /** IANA timezone ID, e.g. "America/Denver". */
  timeZone: string;
}

const DEFAULT_CONFIG: OrgFormatConfig = {
  locale: "en-US",
  currency: "USD",
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

/**
 * Derives a formatting config from an OrganizationInfo object.
 * Falls back to safe defaults for any missing fields.
 */
export function buildOrgFormatConfig(orgInfo?: OrganizationInfo | null): OrgFormatConfig {
  return {
    locale:   orgInfo?.Locale?.Name     || DEFAULT_CONFIG.locale,
    currency: orgInfo?.Currency         || DEFAULT_CONFIG.currency,
    timeZone: orgInfo?.Timezone?.TimezoneId || DEFAULT_CONFIG.timeZone,
  };
}

// ─── Date / DateTime ──────────────────────────────────────────────────────────

/**
 * Formats an ISO date string (YYYY-MM-DD or ISO 8601) as a short date.
 * Example: "3/18/2026" for en-US / Mountain Time.
 * Returns "—" for null / undefined / empty.
 */
export function formatDate(
  iso: string | null | undefined,
  config: OrgFormatConfig = DEFAULT_CONFIG,
): string {
  if (!iso) return "—";
  const d = new Date(
    // If it's a plain date (no time component) append midnight local to avoid
    // UTC-offset day shifts when converting to the org timezone.
    /^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso + "T00:00:00" : iso,
  );
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(config.locale, { timeZone: config.timeZone });
}

/**
 * Formats an ISO datetime string with both date and time.
 * Example: "3/18/2026, 10:00 AM MDT" for en-US / Mountain Time.
 * Returns "—" for null / undefined / empty.
 */
export function formatDateTime(
  iso: string | null | undefined,
  config: OrgFormatConfig = DEFAULT_CONFIG,
): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString(config.locale, {
    timeZone: config.timeZone,
    timeZoneName: "short",
  });
}

// ─── Currency ─────────────────────────────────────────────────────────────────

/**
 * Formats a numeric amount as currency.
 * The `currency` parameter overrides the config (quote-level currency wins).
 * Example: "$1,234.56" for en-US / USD.
 * Returns "—" for null / undefined.
 */
export function formatCurrencyAmount(
  amount: number | null | undefined,
  currency?: string | null,
  config: OrgFormatConfig = DEFAULT_CONFIG,
): string {
  if (amount == null) return "—";
  const code = currency || config.currency;
  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: code,
  }).format(amount);
}
