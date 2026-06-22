import { clientWithToken } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type { CongaAPIResponse, UserAccessDetailsOnRecord } from '../types';

/**
 * Returns the current user's view/edit access level for a given record.
 *
 * @param objectName - The Conga object name (e.g. 'Proposal').
 * @param recordId   - The record ID (e.g. quoteId).
 * @param userId     - The user's ID from OIDC profile (`user.profile.sub`).
 */
export async function getAccessLevel(
  token: string,
  objectName: string,
  recordId: string,
  userId: string,
): Promise<UserAccessDetailsOnRecord> {
  const client = clientWithToken(token);
  const { data } = await client.get<CongaAPIResponse<UserAccessDetailsOnRecord>>(
    API_ENDPOINTS.accessLevel(objectName, recordId, userId),
  );
  if (!data.Success) {
    throw new Error(data.Errors?.[0]?.Message ?? 'Access level fetch failed');
  }
  return data.Data;
}
