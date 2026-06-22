# Conga API Swagger References

Base URL: `https://preview-rls09.congacloud.com` (`NEXT_PUBLIC_CONGA_API_BASE_URL`)

All APIs require a `Bearer` token in the `Authorization` header (sourced from OIDC `user.access_token`).

---

## Swagger Spec URLs

| Service | Swagger JSON | UI |
|---|---|---|
| Quote | `https://preview-rls09.congacloud.com/api/quote/swagger/1.0.0/swagger.json` | `/api/quote/swagger` |
| Data (Access Level) | `https://preview-rls09.congacloud.com/api/data/swagger/v1/swagger.json` | `/api/data/swagger` |
| Schema / Metadata | `https://preview-rls09.congacloud.com/api/schema/swagger/v1/swagger.json` | `/api/schema/swagger` |
| Cart | `https://preview-rls09.congacloud.com/api/cart/swagger/v1/swagger.json` | `/api/cart/swagger` |
| Config Management | `https://preview-rls09.congacloud.com/api/config-management/swagger/v1/swagger.json` | `/api/config-management/swagger` |
| Workflow / Lifecycle | `https://preview-rls09.congacloud.com/api/workflow/swagger/v1/swagger.json` | `/api/workflow/swagger` |
| Revenue Admin (Flow) | `https://preview-rls09.congacloud.com/api/revenue-admin/swagger/1.0.0/swagger.json` | `/api/revenue-admin/swagger` |
| User Management (Org) | `https://preview-rls09.congacloud.com/api/user-management/swagger/v1/swagger.json` | `/api/user-management/swagger` |

---

## Endpoints Used in Quote Details Page

| # | Method | Endpoint | Service File | Criticality |
|---|---|---|---|---|
| 1 | GET | `/api/metadata/v1/objects/{objectName}` | `metadata.service.ts` | **Critical** |
| 2 | GET | `/api/quote/v1/quotes/{quoteId}` | `quote.service.ts` | **Critical** |
| 3 | GET | `/api/data/v1/objects/{objectName}/{recordId}/{userId}/access-level` | `access-level.service.ts` | Non-critical |
| 4 | GET | `/api/cart/v1/business-objects/{quoteId}/carts/active?type=Proposal` | `cart.service.ts` | Non-critical |
| 5 | GET | `/api/config-management/v1/configurations/cpq/QuoteSettings` | `config.service.ts` | Non-critical |
| 6 | GET | `/api/workflow/v1/lifecycle/objects/{objectName}/records/{recordId}/stages` | `workflow.service.ts` | Non-critical |
| 7 | GET | `/api/user-management/v1/organization/info` | `organization.service.ts` | Non-critical |
| 8 | GET | `/api/revenue-admin/v1/flows/{flowName}/settings/configuserpreferences` | `flow.service.ts` | Non-critical |

---

## Key TypeScript Types

```typescript
// src/lib/api/types/common.ts
interface CongaAPIResponse<T> {
  Success: boolean;
  Data: T;
  Errors: Array<{ Message: string }> | null;
  StatusCode: string;
  RecordCount?: number | null;
  HasMoreRecords?: boolean | null;
}

interface LookupObject { Id: string | null; Name: string | null; }
interface CurrencyField { Value: number; DisplayValue: number; CurrencyCode: string; CurrencySymbol: string; }

// src/lib/api/types/proposal.types.ts
interface Proposal { Id, Name, Account: LookupObject, Amount: CurrencyField, ApprovalStage, GrandTotal: CurrencyField, ... }
interface ObjectMetadata { Name, DisplayName, FieldMetadata: FieldMetadata[], PicklistMetadata[], ... }

// src/lib/api/types/access-level.types.ts
interface UserAccessDetailsOnRecord { IsSharingEnabled, IsRecordShared, RecordAccessDetail: { View, Edit } }

// src/lib/api/types/config.types.ts
interface Configuration { Category, Name, Value }  // Value is a JSON string for QuoteSettings

// src/lib/api/types/workflow.types.ts
interface LifecycleStagesData { WorkflowContextData, Stages: LifecycleStageInfo[] }
interface LifecycleStageInfo { StageName, StageDisplayName, SequenceNumber, State, ... }
```

---

## Usage Pattern

```typescript
import { getQuoteDetails, getObjectMetadata } from "@/lib/api";

// In a React client component
const { user } = useAuth();
const token = user.access_token;
const userId = user.profile.sub;

// Parallel fetch (critical)
const [proposal, metadata] = await Promise.all([
  getQuoteDetails(token, quoteId),
  getObjectMetadata(token, "Proposal"),
]);

// Best-effort parallel fetch (non-critical)
const results = await Promise.allSettled([
  getAccessLevel(token, "Proposal", quoteId, userId),
  getActiveCart(token, quoteId),
  // ...
]);
```

---

## URL Parameters (Quote Details Page)

| Parameter | Source | Default | Notes |
|---|---|---|---|
| `quoteId` | URL query string `?quoteId=...` | (required) | Passed to quote + access-level + cart + stages |
| `flowName` | URL query string `?flowName=...` | `system` | Passed to revenue-admin flow settings |
| `userId` | `user.profile.sub` from OIDC | (from auth) | Passed to access-level endpoint |
