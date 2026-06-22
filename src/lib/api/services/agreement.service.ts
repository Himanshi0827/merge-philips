// @ts-nocheck
const CONGA_BASE = 'https://preview-rls09.congacloud.com';

export async function getAgreementLineItems(token: string) {
  const response = await fetch(`${CONGA_BASE}/api/data/v1/objects/AgreementLineItem`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch AgreementLineItem');
  return response.json();
}

export async function createAgreementLineItem(token: string, payload: unknown) {
  try {
    const response = await fetch(`${CONGA_BASE}/api/data/v1/objects/AgreementLineItem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) { const errorData = await response.json(); throw errorData; }
    return response.json();
  } catch (err) { console.error(err); throw err; }
}

export async function getAgreementLineItemById(token: string, id: string) {
  try {
    const response = await fetch(`${CONGA_BASE}/api/data/v1/objects/AgreementLineItem/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });
    if (!response.ok) { const errorText = await response.text(); throw new Error(errorText); }
    const result = await response.json();
    return result.Data;
  } catch (err) { console.error((err as Error).message); }
}

export async function updateAgreementLineItem(token: string, id: string, payload: unknown) {
  try {
    const response = await fetch(`${CONGA_BASE}/api/data/v1/objects/AgreementLineItem/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    if (!response.ok) { const errorData = await response.json(); throw errorData; }
    return response.json();
  } catch (err) { console.error((err as Error).message); throw err; }
}

export async function deleteAgreementLineItem(token: string, id: string) {
  const response = await fetch(`${CONGA_BASE}/api/data/v1/objects/AgreementLineItem/${id}`, {
    method: 'DELETE',
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to delete Agreement Line Item');
  return response.json();
}

export async function getAgreementById(token: string, id: string) {
  try {
    const response = await fetch(`${CONGA_BASE}/api/data/v1/objects/Agreement/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });
    if (!response.ok) { const errorText = await response.text(); throw new Error(errorText); }
    const result = await response.json();
    return result.Data;
  } catch (err) { console.error((err as Error).message); }
}

export async function createAgreementGroup(token: string, agreementgroup: unknown) {
  try {
    const response = await fetch(`${CONGA_BASE}/api/data/v1/objects/APTS_Agreement_Groups_c`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(agreementgroup),
    });
    if (!response.ok) { const errorData = await response.json(); throw errorData; }
    return response.json();
  } catch (err) { console.error((err as Error).message); throw err; }
}

export async function getProductById(token: string, id: string) {
  try {
    const response = await fetch(`${CONGA_BASE}/api/data/v1/objects/Product/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });
    if (!response.ok) { const errorText = await response.text(); throw new Error(errorText); }
    const result = await response.json();
    return result.Data;
  } catch (err) { console.error((err as Error).message); }
}

export async function updateAgreement(token: string, id: string, payload: unknown) {
  try {
    const response = await fetch(`${CONGA_BASE}/api/data/v1/objects/Agreement/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    if (!response.ok) { const errorData = await response.json(); throw errorData; }
    return response.json();
  } catch (err) { console.error((err as Error).message); throw err; }
}

export async function getAmendAgreement(token: string, id: string) {
  try {
    const response = await fetch(`${CONGA_BASE}/api/clm/v1/contracts/${id}/amend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });
    if (!response.ok) { const errorData = await response.json(); throw errorData; }
    const result = await response.json();
    return result.Data;
  } catch (err) { console.error(err); throw err; }
}

export async function SubmitForApproval(token: string, body: unknown) {
  try {
    const response = await fetch(`${CONGA_BASE}/api/approvals/v1/requests/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    if (!response.ok) { const errorText = await response.text(); throw new Error(errorText); }
    return response.json();
  } catch (err) { console.error((err as Error).message); }
}

export async function createAgreement(token: string, payload: unknown) {
  try {
    const response = await fetch(`${CONGA_BASE}/api/data/v1/objects/Agreement`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    if (!response.ok) { const errorData = await response.json(); throw errorData; }
    return response.json();
  } catch (err) { console.error(err); throw err; }
}

export async function getAgreementGroupById(token: string, id: string) {
  try {
    const url = `${CONGA_BASE}/api/data/v1/objects/APTS_Agreement_Groups_c?criteria=APTS_Agreement_c%3D%27${id}%27`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });
    if (!response.ok) { const errorText = await response.text(); throw new Error(errorText); }
    const result = await response.json();
    return result.Data;
  } catch (err) { console.error((err as Error).message); }
}

export async function getAgreementsByIdsBasic(token: string, ids: string[] = []) {
  if (!ids.length) return [];
  const formattedIds = ids.map(id => `'${id}'`).join(',');
  const response = await fetch(`${CONGA_BASE}/api/data/v1/query/Agreement`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      ObjectName: 'Agreement',
      Criteria: `Id IN (${formattedIds}) AND Status = 'Activated' AND StatusCategory = 'In Effect' AND Apttus_Market_c = 'North America' AND APTS_SalesArea_c = 'United States' AND APTS_Country_Code_c = 'US' AND (RecordType = 'GPO_Framework' OR (APTS_Agreement_Sub_Type_c IN ('Cooperative Alliance Agreement', 'Long term strategic partnership', 'Product Specific Pricing', 'Master Purchase Agreement') AND RecordType = 'Customer_Framework')) AND APTS_Member_SAP_Status_c='In Progress'`,
      Select: ['*'],
    }),
  });
  const result = await response.json();
  return result.Data || [];
}

export async function getAgreementsByIdsDesignation(token: string, ids: string[] = [], accountIds: string, memberId: string, gpoId: string) {
  if (!ids.length) return [];
  const formattedIds = ids.map(id => `'${id}'`).join(',');
  const response = await fetch(`${CONGA_BASE}/api/data/v1/query/Agreement`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      ObjectName: 'Agreement',
      Criteria: `Id IN (${formattedIds}) AND Status = 'Activated' AND StatusCategory = 'In Effect' AND Apttus_Market_c = 'North America' AND APTS_SalesArea_c = 'United States' AND APTS_Country_Code_c = 'US' AND ((RecordType = 'GPO_Framework' AND Account.Id != '${gpoId}') OR (APTS_Agreement_Sub_Type_c IN ('Cooperative Alliance Agreement', 'Long term strategic partnership', 'Product Specific Pricing', 'Master Purchase Agreement') AND RecordType = 'Customer_Framework' AND ((Account.Id= '${memberId}' AND APTS_Customer_Pricelist_Customer_c.Id = '${accountIds}') OR (Account.Id!= '${memberId}' AND APTS_Customer_Pricelist_Customer_c.Id = '${accountIds}') OR Account.Id = '${accountIds}')))`,
      Select: ['*'],
    }),
  });
  const result = await response.json();
  return result.Data || [];
}

export async function getAgreementsIds(token: string, ids: string[] = []) {
  if (!ids.length) return [];
  const formattedIds = ids.map(id => `'${id}'`).join(',');
  const response = await fetch(`${CONGA_BASE}/api/data/v1/query/Agreement`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      ObjectName: 'Agreement',
      Criteria: `Id IN (${formattedIds}) AND Status = 'Activated' AND StatusCategory = 'In Effect' AND Apttus_Market_c = 'North America' AND APTS_SalesArea_c = 'United States' AND APTS_Country_Code_c = 'US'`,
      Select: ['*'],
    }),
  });
  const result = await response.json();
  return result.Data || [];
}

export function getUserIdFromToken(token: string) {
  try {
    let t = token;
    if (t.startsWith('Bearer ')) t = t.slice(7);
    const parts = t.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    let decoded: any;
    if (typeof window !== 'undefined' && typeof atob === 'function') {
      decoded = JSON.parse(atob(payload));
    } else {
      decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
    }
    return decoded.c_user_id || decoded.sub || null;
  } catch { return null; }
}
