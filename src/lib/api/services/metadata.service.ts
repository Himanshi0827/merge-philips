import { clientWithToken, getAccessToken } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type { CongaAPIResponse, ObjectMetadata } from '../types';

/**
 * Fetches field and picklist metadata for the given Conga object.
 * Defaults to 'Proposal' which is the primary object for quote details.
 *
 * @critical — quote-details page fails if this call fails.
 */
export async function getObjectMetadata(
  objectName = 'Proposal',
): Promise<ObjectMetadata> {
  const accessToken = getAccessToken();
  const client = clientWithToken(accessToken);
  const { data } = await client.get<CongaAPIResponse<ObjectMetadata>>(
    API_ENDPOINTS.metadata(objectName),
  );
  if (!data.Success) {
    throw new Error(data.Errors?.[0]?.Message ?? 'Metadata fetch failed');
  }
  return data.Data;
}
