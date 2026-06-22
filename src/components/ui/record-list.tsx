/**
 * RecordList — generic, domain-agnostic data table.
 *
 * Renders a full-page list of records with:
 *   - PageHeader with optional "create" action button
 *   - Skeleton loading state (configurable cols × rows)
 *   - Error banner (DS Alert with title + message)
 *   - DS Table with dynamic columns and clickable link cells
 *   - "No records" empty state
 *   - Record count label
 *
 * This component has zero knowledge of Conga domain objects. All
 * data shaping (field-name resolution, href building, etc.) is done
 * by the domain wrapper before passing props here.
 *
 * Usage:
 *   import { RecordList, type ColumnDef } from "@/components/ui/record-list";
 */

import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@conga-cloud/design-system";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

/** A single column definition with a pre-resolved display header. */
export interface ColumnDef {
  /** The key used to look up the value in each row object. */
  fieldName: string;
  /** Already-resolved human-readable column header. */
  header: string;
  /** When true the cell is rendered as a navigation link via `getRowHref`. */
  isLink?: boolean;
}

export interface RecordListProps {
  /** Page title rendered in the PageHeader. */
  title: string;
  /** Resolved column definitions. */
  columns: ColumnDef[];
  /** Flat row objects — values are raw API data. */
  rows: Record<string, unknown>[];
  /** Total record count reported by the API (may be > rows.length). */
  totalCount: number;
  /** The maximum number of records fetched per page — used for the count label. */
  limit: number;
  /** Drives loading/error/ready rendering. */
  status: "loading" | "error" | "ready";
  /** Error message shown when status === "error". */
  error?: string | null;
  /** Show a "create" action button in the header. */
  canCreate?: boolean;
  /** Label for the create button. Defaults to "New". */
  createLabel?: string;
  /** Called when the create button is clicked. */
  onCreateClick?: () => void;
  /**
   * Returns the href for a row, or null/undefined if the row is not navigable.
   * Only called for cells whose `ColumnDef.isLink` is true.
   */
  getRowHref?: (row: Record<string, unknown>) => string | null | undefined;
  /** Number of placeholder columns shown during loading. Defaults to 6. */
  skeletonCols?: number;
  /** Number of placeholder rows shown during loading. Defaults to 10. */
  skeletonRows?: number;
  /** Message shown when status === "ready" but rows is empty. */
  emptyMessage?: string;
  /** Extra classes on the outermost wrapper div. */
  className?: string;
  /** Current 1-based page number. Required to enable pagination controls. */
  currentPage?: number;
  /** Called with the new 1-based page number when the user navigates. */
  onPageChange?: (page: number) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Formats a raw cell value into a display string.
 *
 * - null / undefined → "—"
 * - boolean          → "Yes" / "No"
 * - plain object     → first of: .Name, .Value, .DisplayValue, else "—"
 * - everything else  → String(value)
 */
export function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object" && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;
    return String(obj.Name ?? obj.Value ?? obj.DisplayValue ?? "—");
  }
  return String(value);
}

// ─── Sub-renders ──────────────────────────────────────────────────────────────

function LoadingSkeleton({
  cols,
  rows,
}: {
  cols: number;
  rows: number;
}) {
  return (
    <>
      {/* Header area skeleton */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Skeleton className="mb-2 h-8 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: cols }, (_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }, (_, i) => (
              <TableRow key={i}>
                {Array.from({ length: cols }, (_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function RecordList({
  title,
  columns,
  rows,
  totalCount,
  limit,
  status,
  error,
  canCreate,
  createLabel = "New",
  onCreateClick,
  getRowHref,
  skeletonCols = 6,
  skeletonRows = 10,
  emptyMessage = "No records found.",
  className,
  currentPage = 1,
  onPageChange,
}: RecordListProps) {
  // ── Loading ────────────────────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <div
        className={cn("min-h-screen bg-background p-6 md:p-10", className)}
        role="status"
        aria-label={`Loading ${title}`}
        aria-busy="true"
      >
        <LoadingSkeleton cols={skeletonCols} rows={skeletonRows} />
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (status === "error") {
    return (
      <div className={cn("min-h-screen bg-background p-6 md:p-10", className)}>
        <PageHeader title={title} className="mb-8" />
        <Alert variant="destructive">
          <AlertTitle>Failed to load {title.toLowerCase()}</AlertTitle>
          <AlertDescription>{error ?? "An unexpected error occurred."}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // ── Ready ──────────────────────────────────────────────────────────────────
  const headerActions = canCreate
    ? [{ label: createLabel, variant: "default" as const, onClick: onCreateClick }]
    : [];

  const totalPages = Math.ceil(totalCount / limit);
  const rangeStart = Math.min((currentPage - 1) * limit + 1, totalCount);
  const rangeEnd = Math.min(currentPage * limit, totalCount);

  const countLabel = onPageChange && totalCount > 0
    ? `Showing ${rangeStart}\u2013${rangeEnd} of ${totalCount} records`
    : totalCount > limit
      ? `Showing ${limit} of ${totalCount} records`
      : `${rows.length} record${rows.length !== 1 ? "s" : ""}`;

  return (
    <div className={cn("min-h-screen bg-background p-6 md:p-10", className)}>
      <PageHeader title={title} className="mb-8" actions={headerActions} />

      <p className="mb-4 text-sm text-muted-foreground">{countLabel}</p>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.fieldName}>{col.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length || 1}
                  className="py-12 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, rowIndex) => (
                <TableRow key={(row["Id"] as string | undefined) ?? rowIndex}>
                  {columns.map((col) => {
                    const display = formatCellValue(row[col.fieldName]);
                    const href = col.isLink ? (getRowHref?.(row) ?? null) : null;

                    return (
                      <TableCell key={col.fieldName}>
                        {href ? (
                          <Link
                            href={href}
                            className="font-medium text-blue-600 underline hover:text-blue-800"
                          >
                            {display}
                          </Link>
                        ) : (
                          display
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      {onPageChange && totalPages > 1 && (
        <div className="mt-4 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            aria-label="Go to previous page"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Previous
          </Button>
          <span
            className="text-sm text-muted-foreground"
            aria-live="polite"
            aria-atomic="true"
          >
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            aria-label="Go to next page"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
