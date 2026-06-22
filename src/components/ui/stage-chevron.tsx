"use client";

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StageChevronProps {
  /** Ordered list of stage display labels. */
  stages: string[];
  /** The active stage — matched case-insensitively against `stages`. */
  currentStage: string;
  /**
   * When true, renders a shimmer skeleton instead of real content.
   * Pass this while the stages data is still loading.
   */
  loading?: boolean;
  /** How many skeleton chevrons to render while loading. Default: 5. */
  skeletonCount?: number;
  className?: string;
}

// ---------------------------------------------------------------------------
// Chevron geometry (desktop)
// ---------------------------------------------------------------------------

/** Horizontal depth of the left-notch / right-arrow point in pixels. */
const INDENT = 16;

function getClipPath(index: number, total: number): string {
  if (index === 0)
    return `polygon(0 0, calc(100% - ${INDENT}px) 0, 100% 50%, calc(100% - ${INDENT}px) 100%, 0 100%)`;
  if (index === total - 1)
    return `polygon(0 0, 100% 0, 100% 100%, 0 100%, ${INDENT}px 50%)`;
  return `polygon(0 0, calc(100% - ${INDENT}px) 0, 100% 50%, calc(100% - ${INDENT}px) 100%, 0 100%, ${INDENT}px 50%)`;
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function Skeleton({ count }: { count: number }) {
  return (
    <>
      {/* Mobile skeleton — vertical list */}
      <div className="flex flex-col gap-3 sm:hidden">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-7 w-7 shrink-0 rounded-full bg-muted animate-pulse" />
            <div className="h-4 flex-1 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>

      {/* Desktop skeleton — horizontal chevrons */}
      <div className="hidden sm:flex w-full items-stretch">
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            className={cn("h-10 flex-1 min-w-[80px] bg-muted animate-pulse", i > 0 && "-ml-4")}
            style={{ clipPath: getClipPath(i, count), zIndex: i }}
          />
        ))}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Mobile vertical stepper
// ---------------------------------------------------------------------------

function VerticalStepper({
  stages,
  currentIndex,
}: {
  stages: string[];
  currentIndex: number;
}) {
  const total = stages.length;
  return (
    <div className="flex flex-col">
      {stages.map((stage, i) => {
        const isCurrent = i === currentIndex;
        const isPast = currentIndex !== -1 && i < currentIndex;
        const isLast = i === total - 1;

        return (
          <div key={`${stage}-${i}`} className="flex items-start gap-3">
            {/* Timeline track */}
            <div className="flex flex-col items-center">
              {/* Circle indicator */}
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  isCurrent && "bg-blue-600 text-white ring-4 ring-blue-100",
                  isPast && "bg-blue-100 text-blue-800",
                  !isCurrent && !isPast && "border-2 border-muted bg-background text-muted-foreground",
                )}
              >
                {isPast ? (
                  // Checkmark for completed stages
                  <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              {/* Connecting line — shown for all except the last item */}
              {!isLast && (
                <div
                  className={cn(
                    "mt-1 w-0.5 flex-1 min-h-[1.5rem]",
                    isPast ? "bg-blue-200" : "bg-muted",
                  )}
                />
              )}
            </div>

            {/* Stage label */}
            <div className={cn("pb-5 pt-1 text-sm leading-tight", isLast && "pb-0")}>
              <span
                className={cn(
                  "font-medium",
                  isCurrent && "text-blue-600",
                  isPast && "text-blue-800",
                  !isCurrent && !isPast && "text-muted-foreground",
                )}
              >
                {stage}
              </span>
              {isCurrent && (
                <p className="mt-0.5 text-xs text-muted-foreground">Current stage</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Responsive stage progress indicator.
 *
 * - **Mobile (< sm / 640px)**: vertical stepper with circle indicators,
 *   connecting lines, checkmarks for completed stages, and full-width labels.
 * - **Desktop (≥ sm)**: horizontal chevron bar where stages share the full
 *   container width equally (flex-1) with a per-stage minimum of 80px.
 *
 * Colour states (both layouts):
 * - Past stages  → muted blue fill / checkmark
 * - Current stage → solid blue / highlighted
 * - Future stages → muted grey / outlined
 *
 * Pass `loading={true}` while data is in flight to show a shape-matched
 * shimmer skeleton that prevents layout jump when stages arrive.
 *
 * Usage:
 *   <StageChevron
 *     stages={["Draft", "Pending Approval", "Approved"]}
 *     currentStage="Pending Approval"
 *   />
 */
export function StageChevron({
  stages,
  currentStage,
  loading = false,
  skeletonCount = 5,
  className,
}: StageChevronProps) {
  if (loading) return <div className={className}><Skeleton count={skeletonCount} /></div>;
  if (stages.length === 0) return null;

  const lowerCurrent = currentStage.toLowerCase();
  const currentIndex = stages.findIndex((s) => s.toLowerCase() === lowerCurrent);
  const total = stages.length;

  return (
    <div className={className}>
      {/* ── Mobile: vertical stepper ── */}
      <div className="sm:hidden">
        <VerticalStepper stages={stages} currentIndex={currentIndex} />
      </div>

      {/* ── Desktop: horizontal chevron ── */}
      <div className="hidden sm:flex w-full items-stretch">
        {stages.map((stage, i) => {
          const isCurrent = i === currentIndex;
          const isPast = currentIndex !== -1 && i < currentIndex;

          return (
            <div
              key={`${stage}-${i}`}
              title={stage}
              className={cn(
                "flex flex-1 min-w-[80px] items-center justify-center h-10 text-xs font-medium select-none",
                i > 0 && "-ml-4",
                i === 0 && "pl-4 pr-6",
                i > 0 && i < total - 1 && "px-8",
                i === total - 1 && "pl-8 pr-4",
                isCurrent && "bg-blue-600 text-white",
                isPast && "bg-blue-100 text-blue-800",
                !isCurrent && !isPast && "bg-muted text-muted-foreground",
              )}
              style={{
                clipPath: getClipPath(i, total),
                zIndex: isCurrent ? total + 1 : i + 1,
              }}
            >
              <span className="truncate">{stage}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

