import { clientWithToken } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type { ValidateCartResponse } from '../types/validate-cart';

export async function validateCart(
  token: string,
  proposalId: string
) {
  const client = clientWithToken(token);

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