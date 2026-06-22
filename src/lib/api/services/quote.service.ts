import { clientWithToken } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type { Proposal } from '../types';

/**
 * Fetches a single quote (Proposal) by its ID.
 * The Quote API returns the Proposal object directly (not wrapped in CongaAPIResponse).
 *
 * @critical — quote-details page fails if this call fails.
 */
export async function getQuoteDetails(
  token: string,
  quoteId: string,
): Promise<Proposal> {
  const client = clientWithToken(token);
  const response = await client.get<Proposal>(
    API_ENDPOINTS.quote(quoteId),
  );
  if (response.status !== 200) {
    throw new Error(`Quote fetch failed (HTTP ${response.status})`);
  }
  return response.data;
}

/**
 * Updates a single quote (Proposal) with a partial payload.
 * Only the fields present in `payload` are sent — callers should pass only
 * the changed fields (the dirty map from the edit form).
 *
 * The Quote API returns the updated Proposal directly (not wrapped in CongaAPIResponse).
 */
export async function updateQuote(
  token: string,
  quoteId: string,
  payload: Record<string, unknown>,
): Promise<Proposal> {
  const client = clientWithToken(token);
  const response = await client.put<Proposal>(
    API_ENDPOINTS.quote(quoteId),
    payload,
  );
  if (response.status !== 200) {
    throw new Error(`Quote update failed (HTTP ${response.status})`);
  }
  return response.data;
}
