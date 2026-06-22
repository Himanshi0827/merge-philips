/**
 * Layout metadata for the Proposal/Quote object.
 *
 * Field names MUST match the Conga Platform API field names returned by
 * GET /api/metadata/v1/objects/Proposal (FieldMetadata[].FieldName).
 * See docs/proposalmetadata.json for the full response.
 *
 * editability, fieldType, picklistName, and required are resolved automatically
 * at runtime by TwoColumnSection using the live metadata API response:
 *   • editable      ← metadata WriteAccess = true AND DataType not in
 *                     {Lookup, Currency, AutoNumber, Rollup, MultiPicklist}
 *   • fieldType     ← DataType mapping (String→text, Picklist→picklist, …)
 *   • picklistName  ← metadata PicklistName
 *   • required      ← metadata IsRequired
 *
 * You only need to set these properties explicitly as OVERRIDES when the
 * metadata-derived default is wrong for the field (rare). Always set validate
 * here — custom validation logic is never in metadata.
 *
 * To add a new field: append an entry to INFO_LEFT_FIELDS or INFO_RIGHT_FIELDS.
 * TwoColumnSection will automatically cross-reference it against the live
 * metadata and show an amber dot if the field is not found.
 */

export interface FieldConfig {
  /** Human-readable fallback label (shown when field is absent from metadata). */
  label: string;
  /** Transformed Conga field name — used for metadata lookup and data access. */
  fieldName: string;
  /**
   * Override: mark field as required regardless of metadata IsRequired.
   * Usually left unset — TwoColumnSection resolves this from metadata.
   */
  required?: boolean;
  /**
   * Override: force a field editable (true) or read-only (false) regardless
   * of metadata WriteAccess/DataType. Usually left unset.
   */
  editable?: boolean;
  /**
   * Override: force a specific input control type. Usually left unset —
   * TwoColumnSection derives this from metadata DataType.
   */
  fieldType?: "text" | "textarea" | "date" | "boolean" | "number" | "currency" | "picklist" | "lookup";
  /**
   * Override: picklist key for PicklistMetadata lookup. Usually left unset —
   * TwoColumnSection reads this from metadata PicklistName.
   */
  picklistName?: string;
  /**
   * Client-side validation function called on every change in edit mode.
   * Return an error string to block save; return null when valid.
   * This is never derived from metadata — always define it here when needed.
   */
  validate?: (value: unknown) => string | null;
}

// ─── Information section — left column (top-to-bottom) ──────────────────────

export const QUOTE_INFO_LEFT_FIELDS: FieldConfig[] = [
  { label: "Quote Number",                   fieldName: "APTS_Quote_Number_c" },
  { label: "Version",                        fieldName: "APTS_Version_c" },
  { label: "Original Quote",                 fieldName: "APTS_Original_Quote_c" },
  { label: "Cloned From",                    fieldName: "APTS_Cloned_From_c" },
  { label: "Legacy Quote",                   fieldName: "APTS_Legacy_Quote_c" },
  { label: "Proposal Name",                  fieldName: "ProposalName",
    validate: (v) => (!v || String(v).trim() === "" ? "Proposal Name is required" : null) },
  { label: "Record Type",                    fieldName: "RecordType" },
  { label: "Golden Opportunity ID",          fieldName: "APTS_Golden_Opportunity_ID_c" },
  { label: "Opportunity Owner Fax",          fieldName: "APTS_Opportunity_Owner_Fax_c" },
  { label: "Opportunity Owner Email",        fieldName: "APTS_Opportunity_Owner_Email_c",
    validate: (v) => (v && !/^[^@]+@[^@]+\.[^@]+$/.test(String(v)) ? "Enter a valid email" : null) },
  { label: "Opportunity Owner Phone",        fieldName: "APTS_Opportunity_Owner_Phone_c" },
  { label: "Sold To MP1 Account ID",         fieldName: "APTS_Sold_To_MP1_Account_ID_c" },
  { label: "Ship To MP1 Account ID",         fieldName: "APTS_Ship_To_MP1_Account_ID_c" },
  { label: "Bill To MP1 Account ID",         fieldName: "APTS_Bill_To_MP1_Account_ID_c" },
  { label: "Customer Address",               fieldName: "APTS_Quote_Customer_Address_c" },
  { label: "Country",                        fieldName: "APTS_Country_c" },
  { label: "Market",                         fieldName: "Apttus_Market_c" },
  { label: "Primary Contact",                fieldName: "APTS_Primary_Contact_c" },
  { label: "Customer Title",                 fieldName: "APTS_Quote_Customer_Title_c" },
  { label: "Contact Telephone",              fieldName: "APTS_Quote_Contact_Telephone_Number_c" },
  { label: "Contact Email",                  fieldName: "APTS_Quote_Contact_Email_c",
    validate: (v) => (v && !/^[^@]+@[^@]+\.[^@]+$/.test(String(v)) ? "Enter a valid email" : null) },
  { label: "Comments",                       fieldName: "APTS_Comments_c" },
  { label: "Solution",                       fieldName: "APTS_Solution_c" },
  { label: "Section Name",                   fieldName: "Section_Name_c" },
  { label: "Country Code",                   fieldName: "APTS_Country_code_c" },
  { label: "Best Contract Selected",         fieldName: "APTS_Best_Contract_Selected_c" },
  { label: "Disable BCP",                    fieldName: "APTS_Disable_BCP_c" },
  { label: "CFD Language",                   fieldName: "APTS_CFD_Language_c" },
  { label: "Assets Created",                 fieldName: "APTS_Assets_Created_c" },
  { label: "Payment Term",                   fieldName: "APTS_PaymentTerm_c",
    validate: (v) => (!v ? "Payment Term is required" : null) },
  { label: "Inco Term",                      fieldName: "APTS_IncoTerm_c",
    validate: (v) => (!v ? "Inco Term is required" : null) },
  { label: "Inco Term 2",                    fieldName: "APTS_IncoTerm_2_c" },
  { label: "DMS Hyperlink",                  fieldName: "APTS_Quote_DMS_Hyperlink_c" },
  { label: "T&C Type",                       fieldName: "APTS_T_C_Type_c",
    validate: (v) => (!v ? "T&C Type is required" : null) },
  { label: "IGDT Type",                      fieldName: "APTS_IGDT_Type_c" },
  { label: "Related Framework Contract",     fieldName: "APTS_Related_Framework_Contract_c" },
  { label: "Related Transactional Contract", fieldName: "APTS_Related_Transactional_Contract_c" },
  { label: "CFD Language Change",            fieldName: "APTS_CFDLanguage_Change_c" },
  { label: "Legal Entity",                   fieldName: "APTS_Legal_Entity_c" },
  { label: "Turbo Config",                   fieldName: "APTS_Turbo_Config_c" },
  { label: "Is Service RightFit",            fieldName: "APTS_Is_Service_RightFit_c" },
  { label: "Partner Quote",                  fieldName: "APTS_Partner_Quote_c" },
  { label: "Zone",                           fieldName: "APTS_Zone_c" },
  { label: "Opportunity Territory",          fieldName: "APTS_Opportunity_Territory_c" },
  { label: "Region",                         fieldName: "APTS_Region_c" },
  { label: "Business Unit",                  fieldName: "APTS_Business_Unit_c" },
];

// ─── Information section — right column (top-to-bottom) ──────────────────────

export const QUOTE_INFO_RIGHT_FIELDS: FieldConfig[] = [
  { label: "Owner",                                fieldName: "APTS_Owner_c" },
  { label: "Account Manager",                      fieldName: "APTS_Account_Manager_c" },
  { label: "Last Modified By",                     fieldName: "ModifiedBy" },
  { label: "Created By",                           fieldName: "CreatedBy" },
  { label: "Valid Until Date",                     fieldName: "ValidUntilDate" },
  { label: "Proposal Expiration Date",             fieldName: "ProposalExpirationDate" },
  { label: "Reason for Expiration Date",           fieldName: "APTS_Reason_for_Expiration_Date_c" },
  { label: "Quote Forecasted Revenue Date",        fieldName: "APTS_Quote_Forecasted_Revenue_Date_c" },
  { label: "Primary",                              fieldName: "IsPrimary" },
  { label: "Approval Stage",                       fieldName: "ApprovalStage" },
  { label: "Reason for Closure",                   fieldName: "APTS_Reason_for_closure2_c" },
  { label: "Close Quote",                          fieldName: "APTS_Close_Quote_c" },
  { label: "Price List",                           fieldName: "PriceList" },
  { label: "Currency",                             fieldName: "Currency" },
  { label: "Total List Price",                     fieldName: "APTS_Quote_Total_List_Price_c" },
  { label: "Total Discount Amount",                fieldName: "APTS_Quote_Total_Discount_Amount_c" },
  { label: "Total Discount %",                     fieldName: "APTS_Quote_Total_Discount_Percent_c" },
  { label: "Total Net Value",                      fieldName: "APTS_Quote_Total_Net_Value_c" },
  { label: "Total Net Price excl. Trade-In",       fieldName: "APTS_Total_Net_Price_excl_Trade_In_c" },
  { label: "Trade-In RE",                          fieldName: "APTS_Trade_In_RE_c" },
  { label: "Total Net Value (incl. Trade-In)",     fieldName: "APTS_Total_Net_Value_c" },
  { label: "Industrial Funding Fee %",             fieldName: "APTS_Industrial_Funding_Fee_c" },
  { label: "Industrial Funding Fee Amount",        fieldName: "APTS_Industrial_Funding_Fee_Amt_c" },
  { label: "Total Quote Price",                    fieldName: "APTS_Total_Quote_Price_c" },
  { label: "VAT Amount",                           fieldName: "APTS_VAT_Amount_c_c" },
  { label: "Total Price Incl. Tax excl. Trade-In", fieldName: "APTS_Total_Price_Incl_Tax_excl_Trade_In_c" },
  { label: "Total Net Value incl. VAT",            fieldName: "APTS_Total_Net_Value_incl_VAT_c" },
  { label: "Trade-In PO",                          fieldName: "APTS_Trade_In_PO_c" },
  { label: "Price Realization",                    fieldName: "APTS_Price_Realization_c" },
  { label: "PO Received",                          fieldName: "APTS_PO_Received_c" },
];
