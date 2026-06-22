import { clientWithToken } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type { CongaAPIResponse, LifecycleStagesData } from '../types';

/**
 * Returns the lifecycle stage details for a given Conga object record.
 *
 * @param objectName - The Conga object name (e.g. 'Proposal').
 * @param recordId   - The record ID (e.g. quoteId).
 */
export async function getLifecycleStages(
  token: string,
  objectName: string,
  recordId: string,
): Promise<LifecycleStagesData[]> {
  const client = clientWithToken(token);
  const { data } = await client.get<CongaAPIResponse<LifecycleStagesData[]>>(
    API_ENDPOINTS.lifecycleStages(objectName, recordId),
  );
  if (!data.Success) {
    throw new Error(data.Errors?.[0]?.Message ?? 'Lifecycle stages fetch failed');
  }
  return data.Data ?? [];
}
