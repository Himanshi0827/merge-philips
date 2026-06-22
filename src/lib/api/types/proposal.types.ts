import type { LookupObject, CurrencyField } from './common';

/** Full Proposal (Quote) entity returned by the Quote API. */
export interface Proposal {
  Id: string | null;
  Name: string | null;
  Account: LookupObject;
  Amount: CurrencyField;
  ApprovalStage: string | null;
  AutoActivateOrder: boolean;
  GrandTotal: CurrencyField;
  NetAmount: CurrencyField;
  Opportunity: LookupObject;
  Owner: LookupObject;
  PriceList: LookupObject;
  PrimaryContact: LookupObject;
  ProposalNumber: string | null;
  ExpectedStartDate: string | null;
  ExpectedEndDate: string | null;
  Description?: string | null;
  Currency?: string | null;
  PONumber?: string | null;
  IsActive?: boolean | null;
  ProposalCategory?: string | null;
  Requestor?: LookupObject;
  ContractNumbers?: string | null;
  /** Error message surfaced from background processing — shown as a blocking error banner. */
  APTS_Error_Message_c?: string | null;
  /** True while a background CPQ job is running on this quote — triggers the pending-task warning. */
  IsTaskPending?: boolean | null;
  /** Set when the Sold-To account changes on a Draft quote — triggers the account-update info banner. */
  APTS_Sold_To_Changed_c?: boolean | null;
}

/** Metadata for a single Conga schema field. */
export interface FieldMetadata {
  FieldName: string;
  DisplayName: string;
  DataType: string;
  IsRequired: boolean;
  IsDeprecated: boolean;
  Length?: number | null;
  LookupObjectName?: string | null;
  PicklistName?: string | null;
  IsProtected?: boolean;
  /** Whether the current user can write this field (from the Conga metadata API). */
  WriteAccess?: boolean | null;
  /** Whether the current user can read this field (from the Conga metadata API). */
  ReadAccess?: boolean | null;
  DefaultValue?: unknown;
}

/** A single entry in a Conga PicklistMetadata response. */
export interface PicklistValue {
  Value: string;
  /** The human-readable label shown in the UI (API field: DisplayText). */
  DisplayText: string;
  Sequence: number;
  IsDeprecated: boolean;
}

export interface PicklistMetadata {
  /** The picklist key — matches FieldMetadata.PicklistName (API field: Name). */
  Name: string;
  AllowNonConfiguredPicklistEntries: boolean;
  PicklistEntries: PicklistValue[];
  IsDeprecated: boolean;
}

export interface DependentPicklistEntry {
  ControllingValue: string;
  DependentValues: string[];
}

export interface DependentPicklistMetadata {
  FieldName: string;
  DependsOn: string;
  Dependencies: DependentPicklistEntry[];
}

/** Full metadata for a Conga object (e.g. Proposal). */
export interface ObjectMetadata {
  Name: string;
  DisplayName: string;
  Description?: string | null;
  FieldMetadata: FieldMetadata[];
  PicklistMetadata: PicklistMetadata[];
  DependentPicklistMetadata: DependentPicklistMetadata[];
}
