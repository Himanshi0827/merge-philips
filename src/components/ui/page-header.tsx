/**
 * PageHeader — an extended component built on top of @conga-cloud/design-system primitives.
 *
 * EXTENSION PATTERN
 * -----------------
 * Rather than re-implementing Conga DS components from scratch, we:
 *   1. Import and compose Conga DS primitives (Badge, Button, Breadcrumb, Separator).
 *   2. Define a richer, domain-specific prop interface that maps cleanly onto those primitives.
 *   3. Use the `cn()` utility so consumers can pass `className` to override any default style
 *      without losing Tailwind conflict resolution.
 *   4. Forward a `ref` to the root element so the component integrates with animation
 *      libraries, scroll utilities, or parent layout refs.
 *
 * ADDING PROJECT-SPECIFIC OVERRIDES
 * ----------------------------------
 * Override default styles by passing `className` or the slot-specific class props
 * (e.g. `titleClassName`, `actionsClassName`). Do NOT patch the Conga DS source —
 * keep customisations in this wrapper layer only.
 */

import { Fragment, forwardRef } from "react";
import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Separator,
} from "@conga-cloud/design-system";
import type { ButtonProps } from "@conga-cloud/design-system";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BreadcrumbEntry {
  label: string;
  /** If omitted the entry is rendered as the current (non-link) page segment. */
  href?: string;
}

export interface PageHeaderAction {
  label: string;
  onClick?: () => void;
  /** Forwarded to the underlying Conga DS Button. Defaults to "default". */
  variant?: ButtonProps["variant"];
  disabled?: boolean;
}

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Main page title. */
  title: string;
  /** Optional subtitle shown below the title. */
  description?: string;
  /** Optional badge rendered next to the title (e.g. status). */
  badge?: string;
  /** Variant forwarded to the Conga DS Badge. */
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  /** Breadcrumb trail rendered above the title. */
  breadcrumbs?: BreadcrumbEntry[];
  /** Action buttons rendered to the right of the title on wide screens. */
  actions?: PageHeaderAction[];
  /** Hide the <Separator> below the header. */
  hideSeparator?: boolean;
  // ── Slot-level class overrides ──────────────────────────────────────────────
  /** Extra classes applied to the title/badge row. */
  titleClassName?: string;
  /** Extra classes applied to the actions container. */
  actionsClassName?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * PageHeader
 *
 * Composed entirely from @conga-cloud/design-system primitives.
 * Extend styling via `className` / slot-class props — never edit Conga DS source.
 *
 * @example
 * <PageHeader
 *   title="Quote Details"
 *   badge="Pending Approval"
 *   badgeVariant="secondary"
 *   breadcrumbs={[
 *     { label: "Home", href: "/" },
 *     { label: "Quotes", href: "/quotes" },
 *     { label: "Q-2026-00142" },
 *   ]}
 *   actions={[
 *     { label: "Edit", variant: "outline" },
 *     { label: "Submit for Approval" },
 *   ]}
 * />
 */
export const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(
  (
    {
      title,
      description,
      badge,
      badgeVariant = "secondary",
      breadcrumbs,
      actions,
      hideSeparator = false,
      className,
      titleClassName,
      actionsClassName,
      ...rest
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn("flex flex-col gap-4", className)} {...rest}>
        {/* ── Breadcrumb ── */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, i) => {
                const isLast = i === breadcrumbs.length - 1;
                return (
                  <Fragment key={crumb.label}>
                    <BreadcrumbItem>
                      {isLast || !crumb.href ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={crumb.href}>
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        )}

        {/* ── Title row ── */}
        <div
          className={cn(
            "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
            titleClassName
          )}
        >
          {/* Left: title + badge + description */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold leading-tight">{title}</h1>
              {badge && (
                <Badge variant={badgeVariant}>{badge}</Badge>
              )}
            </div>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>

          {/* Right: action buttons */}
          {actions && actions.length > 0 && (
            <div
              className={cn("flex shrink-0 gap-2", actionsClassName)}
            >
              {actions.map((action) => (
                <Button
                  key={action.label}
                  variant={action.variant ?? "default"}
                  disabled={action.disabled}
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* ── Separator ── */}
        {!hideSeparator && <Separator />}
      </div>
    );
  }
);

PageHeader.displayName = "PageHeader";
