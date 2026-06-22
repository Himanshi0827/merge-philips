// @ts-nocheck
import { getAccessToken } from '../client';
import { getAccessToken } from '../client';
const CONGA_BASE = 'https://preview-rls09.congacloud.com';

export async function getMemberById(id: string) {
  try {
    const response = await fetch(`${CONGA_BASE}/api/data/v1/objects/APTS_Account_Contract_c/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAccessToken()}` },
    });
    if (!response.ok) { const errorText = await response.text(); throw new Error(errorText); }
    const result = await response.json();
    return result.Data;
  } catch (err) { console.error((err as Error).message); }
}

export async function getMember() {
  const response = await fetch(`${CONGA_BASE}/api/data/v1/objects/APTS_Account_Contract_c`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${getAccessToken()}`, 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to fetch Member');
  return response.json();
}

export async function createMember(payload: unknown) {
  const response = await fetch(`${CONGA_BASE}/api/data/v1/objects/APTS_Account_Contract_c`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getAccessToken()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to create member');
  return response.json();
}

export async function getAccountById(id: string) {
  try {
    const response = await fetch(`${CONGA_BASE}/api/data/v1/objects/Account/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAccessToken()}` },
    });
    if (!response.ok) { const errorText = await response.text(); throw new Error(errorText); }
    const result = await response.json();
    return result.Data;
  } catch (err) { console.error((err as Error).message); }
}

export async function queryGetmember(agreement_id: string) {
  const response = await fetch(`${CONGA_BASE}/api/data/v1/query/APTS_Account_Contract_c`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${getAccessToken()}` },
    body: JSON.stringify({ ObjectName: 'APTS_Account_Contract_c', Criteria: `APTS_Related_Agreement_c ='${agreement_id}'`, Select: ['*'] }),
  });
  if (!response.ok) throw new Error('Failed to bring members');
  const result = await response.json();
  return result.Data;
}

export async function getFilteredAccounts() {
  try {
    const response = await fetch(`${CONGA_BASE}/api/data/v1/query/Account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${getAccessToken()}` },
      body: JSON.stringify({
        ObjectName: 'Account',
        Criteria: "Market_c = 'North America' AND Country_c = 'United States' AND MP1_Customer_id_1_c != null AND Inactive_Flag_c = false AND ERP_Account_Group_c = '0001 - SOLD TO PARTY'",
        Select: ['*'],
      }),
    });
    const result = await response.json();
    return result.Data || [];
  } catch (err) { console.error(err); return []; }
}

export async function getAccountsByIds(ids: string[] = []) {
  try {
    if (!ids.length) return [];
    const formattedIds = ids.map(id => `'${id}'`).join(',');
    const response = await fetch(`${CONGA_BASE}/api/data/v1/query/Account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${getAccessToken()}` },
      body: JSON.stringify({ ObjectName: 'Account', Criteria: `Id IN (${formattedIds})`, Select: ['*'] }),
    });
    if (!response.ok) throw new Error('Failed to fetch accounts');
    const result = await response.json();
    return result.Data || [];
  } catch (err) { console.error(err); return []; }
}

export async function getAgreementsByIds(ids: string[] = []) {
  if (!ids.length) return [];
  const formattedIds = ids.map(id => `'${id}'`).join(',');
  const response = await fetch(`${CONGA_BASE}/api/data/v1/query/Agreement`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAccessToken()}` },
    body: JSON.stringify({
      ObjectName: 'Agreement',
      Criteria: `Id IN (${formattedIds}) AND Status = 'Activated' AND StatusCategory = 'In Effect' AND Apttus_Market_c = 'North America' AND APTS_SalesArea_c = 'United States' AND APTS_Country_Code_c = 'US' AND (RecordType = 'GPO_Framework' OR (APTS_Agreement_Sub_Type_c IN ('Cooperative Alliance Agreement', 'Long term strategic partnership', 'Product Specific Pricing', 'Master Purchase Agreement') AND RecordType = 'Customer_Framework')) AND APTS_Member_SAP_Status_c='In Progress'`,
      Select: ['*'],
    }),
  });
  const result = await response.json();
  return result.Data || [];
}

export const buildCriteria = (filters: Record<string, unknown> = {}): string => {
  const clauses: string[] = [];
  Object.entries(filters).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') return;
    if (typeof value === 'object' && (value as any).notNull) { clauses.push(`${key} != null`); }
    else if (typeof value === 'string') { clauses.push(`${key} = '${value}'`); }
    else { clauses.push(`${key} = ${value}`); }
  });
  return clauses.join(' AND ');
};

export async function getAccounts({ filters = {}, likeFields = [], searchText = '' }: { filters?: Record<string, unknown>; likeFields?: string[]; searchText?: string } = {}) {
  try {
    const criteria = buildCriteria(filters);
    const response = await fetch(`${CONGA_BASE}/api/data/v1/query/Account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${getAccessToken()}` },
      body: JSON.stringify({ ObjectName: 'Account', Criteria: criteria, Select: ['*'] }),
    });
    const result = await response.json();
    let data = result.Data || [];
    if (searchText) {
      const lower = searchText.toLowerCase();
      data = data.filter((rec: any) => likeFields.some(field => (rec[field] || '').toString().toLowerCase().includes(lower)));
    }
    return data;
  } catch (err) { console.error(err); return []; }
}

export async function queryGetOIT(member_id: string) {
  const response = await fetch(`${CONGA_BASE}/api/data/v1/query/APTS_OIT_Track_Record_c`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${getAccessToken()}` },
    body: JSON.stringify({ ObjectName: 'APTS_OIT_Track_Record_c', Criteria: `Agreement_Member_c.Id ='${member_id}'`, Select: ['*'] }),
  });
  if (!response.ok) throw new Error('Failed to bring OIT records');
  const result = await response.json();
  return result.Data;
}

export async function updateMember(token: string, id: string, payload: unknown) {
  try {
    const response = await fetch(`${CONGA_BASE}/api/data/v1/objects/APTS_Account_Contract_c/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAccessToken()}` },
      body: JSON.stringify(payload),
    });
    if (!response.ok) { const errorData = await response.json(); throw errorData; }
    return response.json();
  } catch (err) { console.error((err as Error).message); throw err; }
}

export async function getMembershipAgreements(memberId: string) {
  const response = await fetch(`${CONGA_BASE}/api/data/v1/query/APTS_Account_Contract_c`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAccessToken()}` },
    body: JSON.stringify({ ObjectName: 'APTS_Account_Contract_c', Criteria: `APTS_Member_c = '${memberId}'`, Select: ['*'] }),
  });
  const result = await response.json();
  return result.Data;
}

export async function createGPODesignateChange(payload: unknown) {
  const response = await fetch(`${CONGA_BASE}/api/data/v1/objects/APTS_GPO_Designation_Changes_c`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getAccessToken()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to create GPO designation change');
  return response.json();
}

export async function UpdateGPODesignateChange(token: string, id: string, payload: unknown) {
  try {
    const response = await fetch(`${CONGA_BASE}/api/data/v1/objects/APTS_GPO_Designation_Changes_c/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAccessToken()}` },
      body: JSON.stringify(payload),
    });
    if (!response.ok) { const errorData = await response.json(); throw errorData; }
    return response.json();
  } catch (err) { console.error((err as Error).message); throw err; }
}

export async function getRetryRecords(UserId: string) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const formattedDate = sevenDaysAgo.toISOString();
  const response = await fetch(`${CONGA_BASE}/api/data/v1/query/APTS_GPO_Designation_Changes_c`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${getAccessToken()}` },
    body: JSON.stringify({
      ObjectName: 'APTS_GPO_Designation_Changes_c',
      Criteria: `APTS_Status_c = 'Error' AND CreatedDate > '${formattedDate}' AND CreatedBy.Id= '${UserId}'`,
      Select: ['Id', 'APTS_Start_date_c', 'APTS_Error_Message_c', 'APTS_Status_c'],
    }),
  });
  const result = await response.json();
  return result.Data || [];
}

export async function fetchRecords(token: string, accId: string) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const formattedDate = sevenDaysAgo.toISOString();
  const response = await fetch(`${CONGA_BASE}/api/data/v1/query/APTS_GPO_Designation_Changes_c`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${getAccessToken()}` },
    body: JSON.stringify({
      ObjectName: 'APTS_GPO_Designation_Changes_c',
      Criteria: `APTS_Member_Account_c.Id = '${accId}' AND APTS_Status_c = 'Not Processed'`,
      Select: ['*'],
    }),
  });
  const result = await response.json();
  return result.Data || [];
}

export async function getAgreementDetailsByIds(token: string, ids: string[] = [], accountIds: string[] = [], memberId: string) {
  if (!ids.length) return [];
  const formattedIds = ids.length ? ids.map(id => `'${id}'`).join(',') : "''";
  const formattedAccountIds = accountIds.length ? accountIds.map(id => `'${id}'`).join(',') : "''";
  const response = await fetch(`${CONGA_BASE}/api/data/v1/query/Agreement`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAccessToken()}` },
    body: JSON.stringify({
      ObjectName: 'Agreement',
      Criteria: `Id IN (${formattedIds}) AND Status = 'Activated' AND StatusCategory = 'In Effect' AND Apttus_Market_c = 'North America' AND APTS_SalesArea_c = 'United States' AND APTS_Country_Code_c = 'US' AND APTS_Agreement_Sub_Type_c IN ('Cooperative Alliance Agreement', 'Long term strategic partnership', 'Product Specific Pricing', 'Master Purchase Agreement') AND RecordType = 'Customer_Framework' AND ((Account.Id= '${memberId}' AND APTS_Customer_Pricelist_Customer_c.Id IN (${formattedAccountIds})) OR APTS_Customer_Pricelist_Customer_c.Id IN (${formattedAccountIds}) OR Account.Id in (${formattedAccountIds}))`,
      Select: ['Id', 'Name', 'Account'],
    }),
  });
  const result = await response.json();
  return result.Data || [];
}

export async function queryDesignatedContractsByMember(memberId: string) {
  const response = await fetch(`${CONGA_BASE}/api/data/v1/query/APTS_Account_Contract_c`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${getAccessToken()}` },
    body: JSON.stringify({
      ObjectName: 'APTS_Account_Contract_c',
      Criteria: `APTS_Designated_Flag_c = true AND APTS_Member_c = '${memberId}'`,
      Select: ['Id', 'APTS_End_Date_c'],
    }),
  });
  if (!response.ok) throw new Error('Failed to fetch designated account contracts');
  const result = await response.json();
  return result.Data || [];
}

export async function updateAccountContract(token: string, id: string, payload: unknown) {
  try {
    const response = await fetch(`${CONGA_BASE}/api/data/v1/objects/APTS_Account_Contract_c/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAccessToken()}` },
      body: JSON.stringify(payload),
    });
    if (!response.ok) { const errorData = await response.json(); throw errorData; }
    return response.json();
  } catch (err) { console.error((err as Error).message); throw err; }
}

export async function updateAccount(token: string, id: string, payload: unknown) {
  try {
    const response = await fetch(`${CONGA_BASE}/api/data/v1/objects/Account/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAccessToken()}` },
      body: JSON.stringify(payload),
    });
    if (!response.ok) { const errorData = await response.json(); throw errorData; }
    return response.json();
  } catch (err) { console.error((err as Error).message); throw err; }
}

export async function getActiveGPOAgreements(token: string, gpoId: string) {
  const response = await fetch(`${CONGA_BASE}/api/data/v1/query/Agreement`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAccessToken()}` },
    body: JSON.stringify({
      ObjectName: 'Agreement',
      Criteria: `Account.Id = '${gpoId}' AND Status = 'Activated' AND StatusCategory = 'In Effect' AND Apttus_Market_c = 'North America' AND APTS_SalesArea_c = 'United States' AND APTS_Country_Code_c = 'US'`,
      Select: ['*'],
    }),
  });
  const result = await response.json();
  return result.Data || [];
}

export async function getCFAMembersByAgreementIds(token: string, agreementIds: string[] = []) {
  if (!agreementIds.length) return [];
  const formattedIds = agreementIds.map(id => `'${id}'`).join(',');
  const response = await fetch(`${CONGA_BASE}/api/data/v1/query/APTS_Account_Contract_c`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAccessToken()}` },
    body: JSON.stringify({
      ObjectName: 'APTS_Account_Contract_c',
      Criteria: `APTS_Related_Agreement_c IN (${formattedIds})`,
      Select: ['Id', 'APTS_Member_c', 'APTS_Related_Agreement_c', 'APTS_End_Date_c'],
    }),
  });
  const result = await response.json();
  return result.Data || [];
}
