import { clientWithToken } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type { CongaAPIResponse } from '../types';
import type {
  ActionPermissionsData,
  ProposalListView,
  ViewColumnConfig,
} from '../types';

// ---------------------------------------------------------------------------
// Action Permissions
// ---------------------------------------------------------------------------

/**
 * Returns the CRUD permission flags for the current user on the Proposal object.
 *
 * API response: `{ Data: { Proposal: { CREATE: true, UPDATE: true, ... } } }`
 */
export async function getProposalActionPermissions(
  token: string,
): Promise<ActionPermissionsData> {
  const client = clientWithToken(token);
  const { data } = await client.get<CongaAPIResponse<ActionPermissionsData>>(
    API_ENDPOINTS.proposalActionPermissions,
  );
  if (!data.Success) {
    throw new Error(
      data.Errors?.[0]?.Message ?? 'Action permissions fetch failed',
    );
  }
  return data.Data;
}

// ---------------------------------------------------------------------------
// List View Configuration
// ---------------------------------------------------------------------------
/**
 * Returns the list view configuration for the Proposal object.
 *
 * The API returns Data as an array of page-config entries, each with a
 * `Value` field that is a stringified JSON blob. This function:
 *   1. Takes `Data[0]` (the single matching config entry)
 *   2. Parses the `Value` JSON string
 *   3. Finds the `grid` component inside `section.sections[0].components`
 *   4. Returns its `fields` array as `ProposalListView.Fields`
 */
export async function getProposalListView(token: string): Promise<ProposalListView> {
  const client = clientWithToken(token);
  const { data } = await client.get<CongaAPIResponse<Record<string, unknown>[]>>(
    API_ENDPOINTS.proposalListView,
  );
  if (!data.Success) {
    throw new Error(
      data.Errors?.[0]?.Message ?? 'View configuration fetch failed',
    );
  }

  const entries = data.Data;
  if (!Array.isArray(entries) || entries.length === 0) {
    return { Fields: [] };
  }

  // Parse the stringified JSON stored in the `Value` field
  let pageConfig: Record<string, unknown>;
  try {
    pageConfig = JSON.parse(entries[0].Value as string) as Record<string, unknown>;
  } catch {
    return { Fields: [] };
  }

  // Drill down: section → sections[0] → components → find grid → fields
  const sections = (
    (pageConfig.section as Record<string, unknown> | undefined)
      ?.sections as Array<Record<string, unknown>> | undefined
  ) ?? [];

  const components = (
    sections[0]?.components as Array<Record<string, unknown>> | undefined
  ) ?? [];

  const gridComponent = components.find((c) => c.type === 'grid');
  const fields = (gridComponent?.fields as ViewColumnConfig[] | undefined) ?? [];

  return { Fields: fields };
}

// ---------------------------------------------------------------------------
// Proposal Search
// ---------------------------------------------------------------------------

/**
 * Executes the Proposal search POST query and returns the matching records
 * together with the total count.
 *
 * @param fields  - Field names to include in each returned object.
 * @param skip    - Number of records to skip (for pagination). Default: 0.
 * @param limit   - Maximum records to return. Default: 50.
 */
export async function searchProposals(
  token: string,
  fields: string[],
  skip = 0,
  limit = 50,
): Promise<CongaAPIResponse<Record<string, unknown>[]>> {
  const client = clientWithToken(token);
  const { data } = await client.post<CongaAPIResponse<Record<string, unknown>[]>>(
    API_ENDPOINTS.proposalSearch,
    {
      ObjectName: 'Proposal',
      Criteria: '',
      Select: fields,
      Skip: skip,
      Limit: limit,
      Sort: { FieldName: 'ModifiedDate', OrderBy: 'Descending' },
    },
  );
  if (!data.Success) {
    throw new Error(data.Errors?.[0]?.Message ?? 'Proposal search failed');
  }
  return data;
}
