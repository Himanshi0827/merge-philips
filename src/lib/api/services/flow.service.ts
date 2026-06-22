import { clientWithToken } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type { CongaAPIResponse, FlowSettings } from '../types';

/**
 * Fetches user preference settings for the given flow.
 *
 * @param flowName - Flow name from the URL param; defaults to 'system'.
 */
export async function getFlowSettings(
  token: string,
  flowName = 'system',
): Promise<FlowSettings> {
  const client = clientWithToken(token);
  const { data } = await client.get<CongaAPIResponse<FlowSettings>>(
    API_ENDPOINTS.flowSettings(flowName),
  );
  if (!data.Success) {
    throw new Error(data.Errors?.[0]?.Message ?? 'Flow settings fetch failed');
  }
  return data.Data ?? {};
}
