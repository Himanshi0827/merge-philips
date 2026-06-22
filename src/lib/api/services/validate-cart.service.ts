import { clientWithToken, getAccessToken } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type { ValidateCartResponse } from '../types/validate-cart';

export async function validateCart(
  proposalId: string
) {
  const accessToken = getAccessToken();
  const client = clientWithToken(accessToken);

  const { data } =
    await client.post<ValidateCartResponse>(
      API_ENDPOINTS.validateCart,
      {
        ProposalId: proposalId,
        CartId: ''
      }
    );

  if (!data.Success) {
    throw new Error(
      data.Errors?.[0] ??
      'Validate Cart failed'
    );
  }

  return data.Data;
}