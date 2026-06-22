// @ts-nocheck
import { getAccessToken } from '../client';
import { getAccessToken } from '../client';
const CONGA_BASE = 'https://preview-rls09.congacloud.com';

export async function getPriceListById(id: string) {
  const token = getAccessToken();
  try {
    const response = await fetch(`${CONGA_BASE}/api/data/v1/objects/PriceList/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });
    if (!response.ok) { const errorText = await response.text(); throw new Error(errorText); }
    const result = await response.json();
    return result.Data;
  } catch (err) { console.error((err as Error).message); }
}

export async function updatePriceList(id: string, payload: unknown) {
  const token = getAccessToken();
  try {
    const response = await fetch(`${CONGA_BASE}/api/data/v1/objects/PriceList/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    if (!response.ok) { const errorData = await response.json(); throw errorData; }
    return response.json();
  } catch (err) { console.error((err as Error).message); throw err; }
}
