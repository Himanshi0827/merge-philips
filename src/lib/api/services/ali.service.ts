import { getAccessToken } from '../client';

const CONGA_BASE = 'https://preview-rls09.congacloud.com';

function normalizeToken(token?: string) {
  if (!token) return '';
  return token.replace(/^Bearer\s+/i, '').trim();
}

function resolveToken() {
  return normalizeToken(getAccessToken());
}

export async function queryAgreementLineItemsByAgreement(agreementId: string) {
  const accessToken = resolveToken();
  if (!accessToken) throw new Error('Missing access token for queryAgreementLineItemsByAgreement');

  console.log('queryAgreementLineItemsByAgreement', agreementId);
  try {
    const response = await fetch(`${CONGA_BASE}/api/data/v1/query/AgreementLineItem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ ObjectName: 'AgreementLineItem', Criteria: `Agreement ='${agreementId}'`, Select: ['*'] }),
    });
    if (!response.ok) { const errorData = await response.json(); throw errorData; }
    const result = await response.json();
    return result.Data;
  } catch (err) { console.error((err as Error).message); throw err; }
}

export async function queryCheckAgreementGroup(agreement_group_Id: string, name: string) {
  const accessToken = resolveToken();
  if (!accessToken) throw new Error('Missing access token for queryCheckAgreementGroup');

  const response = await fetch(`${CONGA_BASE}/api/data/v1/query/APTS_Agreement_Groups_c`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ ObjectName: 'APTS_Agreement_Groups_c', Criteria: `APTS_Agreement_c ='${agreement_group_Id}' AND Name= '${name}'`, Select: ['Name', 'Id'] }),
  });
  if (!response.ok) throw new Error('Failed to query agreement group');
  const result = await response.json();
  return result.Data;
}

export async function queryGetAgreementDetails(agreement_id: string) {
  const accessToken = resolveToken();
  if (!accessToken) throw new Error('Missing access token for queryGetAgreementDetails');

  const response = await fetch(`${CONGA_BASE}/api/data/v1/query/Agreement`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({
      ObjectName: 'Agreement',
      Criteria: `Id ='${agreement_id}'`,
      Select: ['Id', 'Name', 'Account.Id', 'Account.Name', 'RecordType', 'APTS_Sales_Area_c', 'Apttus_Market_c', 'StatusCategory', 'APTS_Account_Name__c'],
    }),
  });
  if (!response.ok) throw new Error('Failed to query agreement details');
  const result = await response.json();
  return result.Data;
}

export async function queryGetProposal(Account_id: string, fromDate: string, toDate: string) {
  const accessToken = resolveToken();
  if (!accessToken) throw new Error('Missing access token for queryGetProposal');

  const response = await fetch(`${CONGA_BASE}/api/data/v1/query/Proposal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({
      ObjectName: 'Proposal',
      Criteria: `Account.Id ='${Account_id}' AND CreatedDate >= '${fromDate}T00:00:00Z' AND CreatedDate <= '${toDate}T23:59:59Z'`,
      Select: ['Id', 'Name', 'Opportunity.Id', 'Opportunity.Name', 'ProposalNumber', 'CreatedDate', 'CreatedBy.Name'],
    }),
  });
  if (!response.ok) throw new Error('Failed to query proposals');
  const result = await response.json();
  return result.Data;
}

export async function queryGetQuoteItem(Quote_id: string) {
  const accessToken = resolveToken();
  if (!accessToken) throw new Error('Missing access token for queryGetQuoteItem');

  const response = await fetch(`${CONGA_BASE}/api/data/v1/query/LineItem`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ ObjectName: 'LineItem', Criteria: `Proposal_c ='${Quote_id}'`, Select: ['*'] }),
  });
  if (!response.ok) throw new Error('Failed to query line items');
  const result = await response.json();
  return result.Data;
}

export async function queryAgreementGroupByAgreement(agreementId: string) {
  const accessToken = resolveToken();
  if (!accessToken) throw new Error('Missing access token for queryAgreementGroupByAgreement');

  try {
    const response = await fetch(`${CONGA_BASE}/api/data/v1/query/APTS_Agreement_Groups_c`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ ObjectName: 'APTS_Agreement_Groups_c', Criteria: `APTS_Agreement_c ='${agreementId}'`, Select: ['*'] }),
    });
    if (!response.ok) { const errorData = await response.json(); throw errorData; }
    const result = await response.json();
    return result.Data;
  } catch (err) { console.error((err as Error).message); throw err; }
}
