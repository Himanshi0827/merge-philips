"use client";

/**
 * ProposalList — domain wrapper for the Quotes list page.
 *
 * Responsible for:
 *   - Orchestrating the 4-phase Conga API fetch (metadata + permissions +
 *     view config in parallel, then search sequentially)
 *   - Mapping the Conga response shapes into RecordList-compatible props
 *   - Deciding which columns are navigation links and how to build their hrefs
 *
 * Rendering is fully delegated to <RecordList>. This component contains
 * zero layout or table markup.
 *
 * To reuse the list pattern for a different Conga object, copy this file,
 * replace the three API calls in Phase 1, update LINK_FIELD_NAMES and
 * PAGE_TITLE, and point `getRowHref` at the relevant detail page.
 */

import { useReducer, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { RecordList, type ColumnDef } from "@/components/ui/record-list";
import {
  getObjectMetadata,
  getProposalActionPermissions,
  getProposalListView,
  searchProposals,
} from "@/lib/api";
import type { ObjectMetadata, ViewColumnConfig } from "@/lib/api";

// ─── Config ───────────────────────────────────────────────────────────────────

const PAGE_TITLE = "Quotes";
const LIMIT = 50;

/**
 * Field names that render as navigation links to the quote-details page.
 * The link is built from the row's `Id` field via `getRowHref`.
 */
const LINK_FIELD_NAMES = new Set(["ProposalNumber", "ProposalName"]);

// ─── State ────────────────────────────────────────────────────────────────────

interface ListData {
  rows: Record<string, unknown>[];
  totalCount: number;
  columns: ColumnDef[];
  canCreate: boolean;
}

type Action =
  | { type: "RESET" }            // user session change: clears data and resets page to 1
  | { type: "LOADING" }          // Phase 1 bootstrap in progress
  | { type: "ERROR"; error: string }
  | { type: "READY"; data: ListData }
  | { type: "SET_PAGE"; page: number }; // user clicked Previous / Next

interface State {
  status: "loading" | "error" | "ready";
  error: string | null;
  data: ListData | null;
  currentPage: number;
}

const initialState: State = { status: "loading", error: null, data: null, currentPage: 1 };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "RESET":    return { status: "loading", error: null, data: null, currentPage: 1 };
    case "LOADING":  return { ...state, status: "loading", error: null };
    case "ERROR":    return { ...state, status: "error", error: action.error, data: null };
    case "READY":    return { ...state, status: "ready", error: null, data: action.data };
    case "SET_PAGE": return { ...state, currentPage: action.page };
    default:         return state;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Resolves the display header for a column using metadata if available. */
function resolveHeader(col: ViewColumnConfig, metadata: ObjectMetadata): string {
  const metaField = metadata.FieldMetadata.find(
    (f) => f.FieldName === col.name,
  );
  return metaField?.DisplayName ?? col.name;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProposalList() {
  
  const [{ status, error, data, currentPage }, dispatch] = useReducer(reducer, initialState);

  // Caches Phase 1 results (metadata + permissions + view config) between page
  // navigations. Cleared when the user session changes so a new session always
  // triggers a fresh fetch of the three static APIs.
  const phase1Cache = useRef<{
    columns: ColumnDef[];
    selectFields: string[];
    canCreate: boolean;
  } | null>(null);

  // User session change: clear Phase 1 cache and reset to page 1 in one dispatch.
  useEffect(() => {
    phase1Cache.current = null;
    dispatch({ type: "RESET" });
  }, [user]);

  useEffect(() => {
    if (!user?.access_token) return;
    const token = user.access_token;
    let cancelled = false;

    (async () => {
      try {
        let columns: ColumnDef[];
        let selectFields: string[];
        let canCreate: boolean;

        if (!phase1Cache.current) {
          // Phase 1 — parallel: metadata, permissions, view config.
          // Runs only on first load or after a user session change.
          dispatch({ type: "LOADING" });
          const [metadata, permissions, view] = await Promise.all([
            getObjectMetadata( "Proposal"),
            getProposalActionPermissions(token),
            getProposalListView(token),
          ]);
          if (cancelled) return;

          const viewFields = (view.Fields ?? []).filter((f) => f.visible !== false);
          columns = viewFields.map((col) => ({
            fieldName: col.name,
            header: resolveHeader(col, metadata),
            isLink: LINK_FIELD_NAMES.has(col.name),
          }));
          const fieldNames = viewFields.map((c) => c.name);
          // Always include Id — needed to build navigation hrefs.
          selectFields = fieldNames.includes("Id") ? fieldNames : ["Id", ...fieldNames];
          canCreate = permissions["Proposal"]?.CREATE === true;
          phase1Cache.current = { columns, selectFields, canCreate };
        } else {
          // Phase 1 cached — page navigation only; skip the three static API calls.
          ({ columns, selectFields, canCreate } = phase1Cache.current);
        }

        // Phase 2 — search (re-runs on every page change).
        const skip = (currentPage - 1) * LIMIT;
        const searchResult = await searchProposals(token, selectFields, skip, LIMIT);
        if (cancelled) return;

        dispatch({
          type: "READY",
          data: {
            rows: searchResult.Data ?? [],
            totalCount: searchResult.RecordCount ?? 0,
            columns,
            canCreate,
          },
        });
      } catch (err) {
        if (!cancelled) {
          dispatch({
            type: "ERROR",
            error: err instanceof Error ? err.message : "Failed to load quotes.",
          });
        }
      }
    })();

    return () => { cancelled = true; };
  }, [user, currentPage]);

  /** Builds the detail page href for a given row. Returns null if Id is absent. */
  const getRowHref = (row: Record<string, unknown>): string | null => {
    const id = row["Id"] as string | undefined;
    return id ? `/quote-details/${encodeURIComponent(id)}` : null;
  };

  return (
    <RecordList
      title={PAGE_TITLE}
      status={status}
      error={error}
      columns={data?.columns ?? []}
      rows={data?.rows ?? []}
      totalCount={data?.totalCount ?? 0}
      limit={LIMIT}
      canCreate={data?.canCreate}
      createLabel="New Quote"
      getRowHref={getRowHref}
      emptyMessage="No quotes found."
      currentPage={currentPage}
      onPageChange={(page) => dispatch({ type: "SET_PAGE", page })}
    />
  );
}
