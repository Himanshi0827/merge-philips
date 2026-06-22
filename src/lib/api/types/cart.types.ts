import type { LookupObject } from './common';

/** Active cart / ProductConfiguration entity. */
export interface Cart {
  Id: string | null;
  name?: string | null;
  account?: LookupObject;
  approvalStatus?: string | null;
  billingPreference?: LookupObject;
  billToAccount?: LookupObject;
  shipToAccount?: LookupObject;
  status?: string | null;
  flowName?: string | null;
  configType?: string | null;
  useType?: string | null;
  [key: string]: unknown;
}
