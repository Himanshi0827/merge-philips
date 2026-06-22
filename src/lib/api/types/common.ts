/**
 * Standard Conga API response envelope used across all services.
 */
export interface CongaAPIResponse<T> {
  Success: boolean;
  Data: T;
  Errors: Array<{ Message: string }> | null;
  StatusCode: string;
  RecordCount?: number | null;
  HasMoreRecords?: boolean | null;
  NextCursor?: string | null;
}

/** A reference to another record (Id + Name pair). */
export interface LookupObject {
  Id: string | null;
  Name: string | null;
}

/** A monetary value with display formatting. */
export interface CurrencyField {
  Value: number;
  DisplayValue: number;
  CurrencyCode: string;
  CurrencySymbol: string;
}
