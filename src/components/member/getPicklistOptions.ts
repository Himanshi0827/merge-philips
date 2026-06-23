// @ts-nocheck
import { GetPicklists } from "@/lib/api/services/picklist.service";

export async function getPicklistOptions(fieldApiName) {
  const res = await GetPicklists( fieldApiName);
console.log("chg",res);
console.log("chg2",res?.Data?.PicklistMetadata[0]?.PicklistEntries);
  return (
    res?.Data?.PicklistMetadata[0]?.PicklistEntries?.map((p) => ({
      label: p.DisplayText,
      value: p.Value,
    })) || []
  );
}
