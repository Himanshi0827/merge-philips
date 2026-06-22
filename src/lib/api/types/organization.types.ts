/** Organization information from user-management. */
export interface OrganizationInfo {
  // ── Identity ────────────────────────────────────────────────────────────────
  OrganizationId?: string | null;
  OrganizationName?: string | null;
  OrganizationDisplayName?: string | null;
  /** @deprecated legacy fields kept for compatibility */
  Id?: string | null;
  Name?: string | null;
  FriendlyId?: string | null;
  // ── Formatting ──────────────────────────────────────────────────────────────
  /** ISO 4217 currency code, e.g. "USD". */
  Currency?: string | null;
  /** JSON string — PositiveCurrencyFormat / NegativeCurrencyFormat (often null). */
  CurrencyFormat?: string | null;
  Timezone?: {
    TimezoneName?: string | null;
    /** IANA timezone ID, e.g. "America/Denver". */
    TimezoneId?: string | null;
    TimezoneAlternateId?: string | null;
  } | null;
  Locale?: {
    DisplayName?: string | null;
    /** BCP 47 locale tag, e.g. "en-US". */
    Name?: string | null;
    NumberFormat?: {
      DecimalSymbol?: string | null;
      DigitGroup?: string | null;
      DigitGroupingSymbol?: string | null;
      NegativeNumberFormat?: string | null;
    } | null;
    DateFormat?: {
      LongDateFormat?: string | null;
      /** Short date pattern string, e.g. "M/d/yyyy" — informational only. */
      ShortDateFormat?: string | null;
      TimeFormat?: string | null;
    } | null;
  } | null;
  // ── Misc ────────────────────────────────────────────────────────────────────
  InstanceURL?: string | null;
  IsActive?: boolean | null;
  [key: string]: unknown;
}
