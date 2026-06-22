// @ts-nocheck
const CONGA_BASE = 'https://preview-rls09.congacloud.com';

export async function GetRecords(token: string, Objects: string) {
  try {
    const response = await fetch(`${CONGA_BASE}/api/data/v1/objects/${Objects}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` },
    });
    if (!response.ok) { const errorText = await response.text(); throw new Error(errorText); }
    return response.json();
  } catch (err) { console.error((err as Error).message); }
}
