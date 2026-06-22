"use client";

import { useEffect, useReducer } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { AuthGuard } from "@/components/auth-guard";
import { PageHeader } from "@/components/ui/page-header";
import { TwoColumnSection } from "@/components/ui/two-column-section";
import { ProposalMessages } from "@/components/ui/proposal-messages";
import { ProposalChevron } from "@/components/ui/proposal-chevron";
import {
  Alert,
  AlertDescription,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@conga-cloud/design-system";
import {
  QUOTE_INFO_LEFT_FIELDS,
  QUOTE_INFO_RIGHT_FIELDS,
} from "@/lib/layouts/quote.layout";
import {
  getObjectMetadata,
  getQuoteDetails,
  updateQuote,
  getAccessLevel,
  getActiveCart,
  getQuoteSettings,
  getLifecycleStages,
  getOrganizationInfo,
  getFlowSettings,
} from "@/lib/api";
import type {
  Proposal,
  ObjectMetadata,
  UserAccessDetailsOnRecord,
  Cart,
  QuoteSettings,
  LifecycleStagesData,
  OrganizationInfo,
  FlowSettings,
} from "@/lib/api";
import {
  buildOrgFormatConfig,
  formatDate,
  formatCurrencyAmount,
  type OrgFormatConfig,
} from "@/lib/formatting";
import { useAuth } from "@/lib/auth/auth-context";

// Types
interface QuotePageData {
  proposal: Proposal;
  metadata: ObjectMetadata;
  orgInfo: OrganizationInfo;  // critical — loaded with proposal + metadata
  accessLevel?: UserAccessDetailsOnRecord;
  cart?: Cart;
  quoteSettings?: QuoteSettings;
  stages?: LifecycleStagesData[];
  flowSettings?: FlowSettings;
}

// Page state managed by a reducer so every transition is a single dispatch
type PageStatus = "idle" | "loading" | "error" | "ready";

type PageAction =
  | { type: "LOADING" }
  | { type: "ERROR"; error: string }
  | { type: "READY"; data: QuotePageData }
  | { type: "PATCH"; patch: Partial<QuotePageData> }
  // ── Edit mode ────────────────────────────────────────────────────────────
  | { type: "ENTER_EDIT" }
  | { type: "CANCEL_EDIT" }
  | { type: "FIELD_CHANGE"; fieldName: string; value: unknown; error: string | null }
  | { type: "SAVE_START" }
  | { type: "SAVE_SUCCESS"; proposal: Proposal }
  | { type: "SAVE_ERROR"; error: string };

interface PageState {
  status: PageStatus;
  error: string | null;
  data: QuotePageData | null;
  // Edit mode
  isEditing: boolean;
  draftValues: Record<string, unknown>;
  fieldErrors: Record<string, string>;
  isSaving: boolean;
  saveError: string | null;
}

const initialPageState: PageState = {
  status: "idle",
  error: null,
  data: null,
  isEditing: false,
  draftValues: {},
  fieldErrors: {},
  isSaving: false,
  saveError: null,
};

function pageReducer(state: PageState, action: PageAction): PageState {
  switch (action.type) {
    case "LOADING":
      return { ...initialPageState, status: "loading" };
    case "ERROR":
      return { ...state, status: "error", error: action.error, data: null };
    case "READY":
      return { ...state, status: "ready", error: null, data: action.data };
    case "PATCH":
      if (!state.data) return state;
      return { ...state, data: { ...state.data, ...action.patch } };
    case "ENTER_EDIT":
      return { ...state, isEditing: true, draftValues: {}, fieldErrors: {}, saveError: null };
    case "CANCEL_EDIT":
      return { ...state, isEditing: false, draftValues: {}, fieldErrors: {}, isSaving: false, saveError: null };
    case "FIELD_CHANGE": {
      const newDraft = { ...state.draftValues };
      const newErrors = { ...state.fieldErrors };
      // If the new value matches the saved value, remove from draft (field reverted)
      const savedValue = state.data?.proposal
        ? (state.data.proposal as unknown as Record<string, unknown>)[action.fieldName]
        : undefined;
      if (action.value === savedValue) {
        delete newDraft[action.fieldName];
      } else {
        newDraft[action.fieldName] = action.value;
      }
      if (action.error) {
        newErrors[action.fieldName] = action.error;
      } else {
        delete newErrors[action.fieldName];
      }
      return { ...state, draftValues: newDraft, fieldErrors: newErrors };
    }
    case "SAVE_START":
      return { ...state, isSaving: true, saveError: null };
    case "SAVE_SUCCESS":
      return {
        ...state,
        isSaving: false,
        isEditing: false,
        draftValues: {},
        fieldErrors: {},
        saveError: null,
        data: state.data ? { ...state.data, proposal: action.proposal } : state.data,
      };
    case "SAVE_ERROR":
      return { ...state, isSaving: false, saveError: action.error };
    default:
      return state;
  }
}

const statusVariantMap: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  "Pending Approval": "secondary",
  Approved: "default",
  Rejected: "destructive",
  Draft: "outline",
};



function QuoteDetailsContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  

  const quoteId = (params.quoteId as string) ?? "";
  const flowName = searchParams.get("flowName") ?? "system";

  const [state, dispatch] = useReducer(pageReducer, initialPageState);
  const { status, error, data, isEditing, draftValues, fieldErrors, isSaving, saveError } = state;

  useEffect(() => {
    if (!quoteId || !user?.access_token) return;

    const userId = user.profile.sub;
    let cancelled = false;

    dispatch({ type: "LOADING" });

    (async () => {
      // Critical APIs — page cannot render without these
      let proposal: Proposal;
      let metadata: ObjectMetadata;
      let orgInfo: OrganizationInfo;

      try {
        [proposal, metadata, orgInfo] = await Promise.all([
          getQuoteDetails( quoteId),
          getObjectMetadata( "Proposal"),
          getOrganizationInfo(),
        ]);
      } catch (err) {
        if (!cancelled) {
          dispatch({
            type: "ERROR",
            error:
              err instanceof Error ? err.message : "Failed to load quote data.",
          });
        }
        return;
      }

      // Render immediately with critical data — non-critical fills in progressively
      if (cancelled) return;
      dispatch({ type: "READY", data: { proposal, metadata, orgInfo } });

      // Non-critical APIs — each dispatches PATCH as soon as it resolves
      const patch = <K extends keyof QuotePageData>(key: K) =>
        (value: QuotePageData[K]) => {
          if (!cancelled) dispatch({ type: "PATCH", patch: { [key]: value } as Partial<QuotePageData> });
        };

      getAccessLevel( "Proposal", quoteId, userId)
        .then(patch("accessLevel"))
        .catch(() => {});
      getActiveCart( quoteId)
        .then(patch("cart"))
        .catch(() => {});
      getQuoteSettings()
        .then(patch("quoteSettings"))
        .catch(() => {});
      getLifecycleStages("Proposal", quoteId)
        .then(patch("stages"))
        .catch(() => {});
      getFlowSettings( flowName)
        .then(patch("flowSettings"))
        .catch(() => {});
    })();

    return () => {
      cancelled = true;
    };
  }, [quoteId, flowName, user]);

  if (!quoteId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>No Quote Selected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Please navigate to{" "}
              <code>/quote-details/&lt;quoteId&gt;</code>.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "idle" || status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Loading quote…</p>
      </div>
    );
  }

  if (status === "error" || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-destructive">
              Failed to Load Quote
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { proposal, metadata, stages, accessLevel, orgInfo } = data;
  // Build format config from org settings; override currency with quote-level value.
  const orgFormat: OrgFormatConfig = {
    ...buildOrgFormatConfig(orgInfo),
    currency: proposal.Currency ?? buildOrgFormatConfig(orgInfo).currency,
  };
  const currency = orgFormat.currency;
  const approvalStage = proposal.ApprovalStage ?? "Draft";

  const isDirty = Object.keys(draftValues).length > 0;
  const hasErrors = Object.keys(fieldErrors).length > 0;
  const canSave = isDirty && !hasErrors && !isSaving;

  // Handle save
  async function handleSave() {
    if (!canSave || !user?.access_token) return;
    dispatch({ type: "SAVE_START" });
    try {
      const updated = await updateQuote(quoteId, draftValues);
      dispatch({ type: "SAVE_SUCCESS", proposal: updated });
    } catch (err) {
      dispatch({
        type: "SAVE_ERROR",
        error: err instanceof Error ? err.message : "Save failed.",
      });
    }
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <PageHeader
        className="mb-8"
        title={proposal.Name ?? quoteId}
        badge={approvalStage}
        badgeVariant={statusVariantMap[approvalStage] ?? "secondary"}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Quotes", href: "/quotes" },
          { label: proposal.ProposalNumber ?? quoteId },
        ]}
        actions={[
          // ── Edit mode buttons ───────────────────────────────────────────
          ...(isEditing
            ? [
                ...(canSave
                  ? [{ label: isSaving ? "Saving\u2026" : "Save", variant: "default" as const, onClick: handleSave, disabled: isSaving }]
                  : []),
                { label: "Cancel", variant: "outline" as const, onClick: () => dispatch({ type: "CANCEL_EDIT" }), disabled: isSaving },
              ]
            : [
                // ── View mode buttons ─────────────────────────────────────
                // Show Edit unless the access API has loaded *and* explicitly denied Edit.
                ...(!accessLevel || accessLevel?.RecordAccessDetail?.Edit
                  ? [{ label: "Edit", variant: "outline" as const, onClick: () => dispatch({ type: "ENTER_EDIT" }) }]
                  : []),
                  { label: "Edit New", variant: "outline" as const, onClick: () => dispatch({ type: "ENTER_EDIT" }) },
                { label: "Export PDF", variant: "outline" as const },
                { label: "Submit for Approval" },
              ]),
        ]}
      />
      {/* Save error banner */}
      {saveError && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{saveError}</AlertDescription>
        </Alert>
      )}
      <ProposalMessages proposal={proposal} className="mb-6" />
      <ProposalChevron proposal={proposal} stages={stages} className="mb-8" />
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
        {[
          { label: "Quote #", value: proposal.ProposalNumber ?? quoteId },
          { label: "Account", value: proposal.Account?.Name ?? "—" },
          { label: "Owner", value: proposal.Owner?.Name ?? "—" },
          {
            label: "Grand Total",
            value: formatCurrencyAmount(proposal.GrandTotal?.Value, currency, orgFormat),
          },
          { label: "Approval Stage", value: approvalStage },
          { label: "Price List", value: proposal.PriceList?.Name ?? "—" },
          {
            label: "Start Date",
            value: formatDate(proposal.ExpectedStartDate, orgFormat),
          },
          {
            label: "End Date",
            value: formatDate(proposal.ExpectedEndDate, orgFormat),
          },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-semibold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="details">
        <TabsList className="mb-6">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="stages">Lifecycle Stages</TabsTrigger>
          <TabsTrigger value="access">Access &amp; Org</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          {/* Legend */}
          <p className="text-xs text-muted-foreground mb-4 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
            Field not found in metadata — value is a placeholder
          </p>

          <TwoColumnSection
            title="Information"
            leftFields={QUOTE_INFO_LEFT_FIELDS}
            rightFields={QUOTE_INFO_RIGHT_FIELDS}
            data={proposal as unknown as Record<string, unknown>}
            metadata={metadata}
            orgFormat={orgFormat}
            isEditing={isEditing}
            editValues={draftValues}
            onFieldChange={(fieldName, value, error) =>
              dispatch({ type: "FIELD_CHANGE", fieldName, value, error })
            }
            fieldErrors={fieldErrors}
          />
        </TabsContent>

        <TabsContent value="stages">
          <Card>
            <CardHeader>
              <CardTitle>Lifecycle Stages</CardTitle>
            </CardHeader>
            <CardContent>
              {stages && stages.length > 0 ? (
                <div className="space-y-4">
                  {stages[0]?.Stages?.map((stage) => (
                    <div
                      key={stage.StageName}
                      className="flex items-start gap-3 text-sm"
                    >
                      <span
                        className={`mt-0.5 h-2.5 w-2.5 rounded-full shrink-0 ${
                          stage.State === "Active" || stage.State === "Current"
                            ? "bg-green-500"
                            : stage.State === "Completed"
                              ? "bg-blue-500"
                              : "bg-muted-foreground/30"
                        }`}
                      />
                      <div>
                        <p className="font-medium">
                          {stage.StageDisplayName ?? stage.StageName}
                        </p>
                        {stage.StageDescription && (
                          <p className="text-muted-foreground text-xs mt-0.5">
                            {stage.StageDescription}
                          </p>
                        )}
                        <p className="text-muted-foreground text-xs">
                          State: {stage.State ?? "Unknown"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No lifecycle stage data available.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Record Access</CardTitle>
              </CardHeader>
              <CardContent>
                {accessLevel && accessLevel.RecordAccessDetail ? (
                  <dl className="grid grid-cols-2 gap-4 text-sm">
                    {[
                      {
                        label: "Can View",
                        value: accessLevel?.RecordAccessDetail?.View
                          ? "Yes"
                          : "No",
                      },
                      {
                        label: "Can Edit",
                        value: accessLevel?.RecordAccessDetail?.Edit
                          ? "Yes"
                          : "No",
                      },
                      {
                        label: "Sharing Enabled",
                        value: accessLevel?.IsSharingEnabled ? "Yes" : "No",
                      },
                      {
                        label: "Record Shared",
                        value:
                          accessLevel?.IsRecordShared == null
                            ? "—"
                            : accessLevel?.IsRecordShared
                              ? "Yes"
                              : "No",
                      },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <dt className="text-muted-foreground font-medium">
                          {label}
                        </dt>
                        <dd className="mt-0.5 font-semibold">{value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Access level data unavailable.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 gap-4 text-sm">
                  {[
                    { label: "Name",     value: orgInfo.OrganizationDisplayName ?? orgInfo.OrganizationName ?? "—" },
                    { label: "ID",       value: orgInfo.OrganizationId ?? "—" },
                    { label: "Currency", value: orgInfo.Currency ?? "—" },
                    { label: "Locale",   value: orgInfo.Locale?.DisplayName ?? orgInfo.Locale?.Name ?? "—" },
                    { label: "Timezone", value: orgInfo.Timezone?.TimezoneName ?? orgInfo.Timezone?.TimezoneId ?? "—" },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <dt className="text-muted-foreground font-medium">{label}</dt>
                      <dd className="mt-0.5 font-semibold">{value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function QuoteDetailsPage() {
  return (
    <AuthGuard>
      <QuoteDetailsContent />
    </AuthGuard>
  );
}
