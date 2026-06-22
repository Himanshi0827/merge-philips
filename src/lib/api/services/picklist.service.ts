// @ts-nocheck
import { getAccessToken } from '../client';
const CONGA_BASE = 'https://preview-rls09.congacloud.com';

export async function GetPicklist(fieldname: string) {
  const accessToken = getAccessToken();
  try {
    const response = await fetch(
      `${CONGA_BASE}/api/metadata/v1/objects/AgreementLineItem/fields/${fieldname}/dependency-fields`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${accessToken}` },
      },
    );
    if (!response.ok) { const errorText = await response.text(); throw new Error(errorText); }
    return response.json();
  } catch (err) { console.error((err as Error).message); }
}

export async function GetPicklists(fieldname: string) {
  const accessToken = getAccessToken();
  try {
    const response = await fetch(
      `${CONGA_BASE}/api/metadata/v1/objects/APTS_Account_Contract_c/fields/${fieldname}/dependency-fields`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${accessToken}` },
      },
    );
    if (!response.ok) { const errorText = await response.text(); throw new Error(errorText); }
    return response.json();
  } catch (err) { console.error((err as Error).message); }
}
