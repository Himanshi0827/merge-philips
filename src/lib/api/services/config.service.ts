import { clientWithToken, getAccessToken } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type { CongaAPIResponse, Configuration, QuoteSettings } from '../types';

/**
 * Fetches the QuoteSettings configuration entry (category = 'cpq').
 * The raw `Value` field is a JSON string; this function parses it into an
 * object for convenience.
 */
export async function getQuoteSettings(): Promise<QuoteSettings> {
  const accessToken = getAccessToken();
  const client = clientWithToken(accessToken);
  const { data } = await client.get<CongaAPIResponse<Configuration>>(
    API_ENDPOINTS.quoteSettings,
  );
  if (!data.Success) {
    throw new Error(data.Errors?.[0]?.Message ?? 'QuoteSettings fetch failed');
  }
  const raw = data.Data?.Value;
  if (!raw) return {};
  try {
    return JSON.parse(raw) as QuoteSettings;
  } catch {
    return { raw };
  }
}
