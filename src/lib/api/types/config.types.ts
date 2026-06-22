/** A single configuration entry from config-management. */
export interface Configuration {
  Category: string | null;
  Name: string | null;
  /** Raw value string — may be JSON; parse as needed. */
  Value: string | null;
}

/** QuoteSettings parsed from Configuration.Value JSON. */
export type QuoteSettings = Record<string, unknown>;
