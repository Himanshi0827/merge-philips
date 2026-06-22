// @ts-nocheck
import { getAccessToken } from '../client';
const CONGA_BASE = 'https://preview-rls09.congacloud.com';

export async function GetRecords(Objects: string) {
  const accessToken = getAccessToken();
  try {
    const response = await fetch(`${CONGA_BASE}/api/data/v1/objects/${Objects}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) { const errorText = await response.text(); throw new Error(errorText); }
    return response.json();
  } catch (err) { console.error((err as Error).message); }
}
