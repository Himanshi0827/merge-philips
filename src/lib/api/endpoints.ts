/**
 * Conga API endpoint definitions.
 *
 * All endpoint paths live here so they are easy to update when the API version
 * or path changes. Service functions import from this file instead of
 * embedding path strings inline.
 *
 * Functions accept only the dynamic segments; `encodeURIComponent` is applied
 * here so callers never have to remember to encode.
 */

export const API_ENDPOINTS = {
  /** GET | PUT /api/quote/v1/quotes/{quoteId} — returns Proposal directly */
  quote: (quoteId: string) =>
    `/api/quote/v1/quotes/${encodeURIComponent(quoteId)}`,

  /** GET /api/metadata/v1/objects/{objectName} */
  metadata: (objectName: string) =>
    `/api/metadata/v1/objects/${encodeURIComponent(objectName)}`,

  /** GET /api/cart/v1/business-objects/{quoteId}/carts/active */
  activeCart: (quoteId: string) =>
    `/api/cart/v1/business-objects/${encodeURIComponent(quoteId)}/carts/active`,

  /** GET /api/config-management/v1/configurations/cpq/QuoteSettings */
  quoteSettings: '/api/config-management/v1/configurations/cpq/QuoteSettings',

  /** GET /api/revenue-admin/v1/flows/{flowName}/settings/configuserpreferences */
  flowSettings: (flowName: string) =>
    `/api/revenue-admin/v1/flows/${encodeURIComponent(flowName)}/settings/configuserpreferences`,

  /** GET /api/data/v1/objects/{objectName}/{recordId}/{userId}/access-level */
  accessLevel: (objectName: string, recordId: string, userId: string) =>
    `/api/data/v1/objects/${encodeURIComponent(objectName)}/${encodeURIComponent(recordId)}/${encodeURIComponent(userId)}/access-level`,

  /** GET /api/user-management/v1/organization/info */
  organizationInfo: '/api/user-management/v1/organization/info',

  /** GET /api/workflow/v1/lifecycle/objects/{objectName}/records/{recordId}/stages */
  lifecycleStages: (objectName: string, recordId: string) =>
    `/api/workflow/v1/lifecycle/objects/${encodeURIComponent(objectName)}/records/${encodeURIComponent(recordId)}/stages`,

  /** GET /api/user-management/v1/user/objects/Proposal/actionpermissions */
  proposalActionPermissions:
    '/api/user-management/v1/user/objects/Proposal/actionpermissions',

  /** GET /api/plat-admin/v1/views/page-configuration/{pageConfigId} */
  proposalListView:
    '/api/plat-admin/v1/views/page-configuration/cpq-web::proposal::::list::proposal-List',

  /** POST /api/search/v1/objects/Proposal/query?includeTotalCount=true */
  proposalSearch:
    '/api/search/v1/objects/Proposal/query?includeTotalCount=true',

    validateCart:
    '/api/custom-api/v1/Philips_RLPCustomAPIs/ValidateCart',
} as const;
