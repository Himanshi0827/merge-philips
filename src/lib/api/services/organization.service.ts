import { clientWithToken } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type { CongaAPIResponse, OrganizationInfo } from '../types';

/** Fetches the current tenant's organization information. */
export async function getOrganizationInfo(token: string): Promise<OrganizationInfo> {
  const client = clientWithToken(token);
  const { data } = await client.get<CongaAPIResponse<OrganizationInfo>>(
    API_ENDPOINTS.organizationInfo,
  );
  if (!data.Success) {
    throw new Error(data.Errors?.[0]?.Message ?? 'Organization info fetch failed');
  }
  return data.Data;
}
