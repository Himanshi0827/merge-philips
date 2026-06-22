// @ts-nocheck
import axios from 'axios';

const CONGA_BASE = 'https://preview-rls09.congacloud.com';

export const searchLookupRecords = async (token: string, criteria: unknown, objectName: string) => {
  const response = await axios.post(
    `${CONGA_BASE}/api/search/v1/objects/${objectName}/query?includeTotalCount=true`,
    {
      ObjectName: objectName,
      Criteria: criteria,
      SearchType: 'TypeAhead',
      limit: 100,
      Skip: 0,
      Select: [],
      AdditionalTypeAheadFilterCriteria: '',
    },
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data?.Data || [];
};

export async function GetLookup(token: string, fields: string) {
  try {
    const response = await fetch(`${CONGA_BASE}/api/data/v1/objects/${fields}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) { const errorText = await response.text(); throw new Error(errorText); }
    return response.json();
  } catch (err) { console.error((err as Error).message); }
}
