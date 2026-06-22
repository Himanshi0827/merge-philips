import { clientWithToken } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type { CongaAPIResponse, Cart } from '../types';

/**
 * Returns the active cart associated with the given business object (quote).
 */
export async function getActiveCart(
  token: string,
  quoteId: string,
  type = 'Proposal',
): Promise<Cart> {
  const client = clientWithToken(token);
  const { data } = await client.get<CongaAPIResponse<Cart>>(
    API_ENDPOINTS.activeCart(quoteId),
    { params: { type } },
  );
  if (!data.Success) {
    throw new Error(data.Errors?.[0]?.Message ?? 'Active cart fetch failed');
  }
  return data.Data;
}
