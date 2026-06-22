"use client";

import { Alert, AlertDescription, AlertTitle } from "@conga-cloud/design-system";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MessageVariant = "error" | "warning" | "info";

export interface MessageConfig {
  /** Stable React list key. */
  key: string;
  /** The body text displayed inside the alert. */
  message: string;
  /** Controls colour and icon treatment. */
  variant: MessageVariant;
  /** Optional bold title rendered above the message body. */
  title?: string;
  /** When false the entry is not rendered at all. Compute this from your data. */
  show: boolean;
}

interface PageMessagesProps {
  messages: MessageConfig[];
  className?: string;
}

// ---------------------------------------------------------------------------
// Variant → className mapping
// DS Alert supports "default" and "destructive" natively.
// Warning and info are achieved via Tailwind className overrides (cn() pattern).
// ---------------------------------------------------------------------------

const variantClasses: Record<MessageVariant, string> = {
  error: "",   // uses Alert variant="destructive" — no extra class needed
  warning:
    "border-yellow-500 bg-yellow-50 text-yellow-900 [&>svg]:text-yellow-600 dark:border-yellow-500/50 dark:bg-yellow-950 dark:text-yellow-300",
  info:
    "border-blue-500 bg-blue-50 text-blue-900 [&>svg]:text-blue-600 dark:border-blue-500/50 dark:bg-blue-950 dark:text-blue-300",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Generic multi-message banner bar.
 *
 * Pass a `MessageConfig[]` array with a `show` boolean per entry.
 * Only entries where `show === true` are rendered.
 * Returns null when no entries are visible — zero visual footprint.
 *
 * Usage:
 *   const messages: MessageConfig[] = [
 *     { key: "err", variant: "error", message: errorText, show: !!errorText },
 *     { key: "warn", variant: "warning", message: "Watch out!", show: isWarning },
 *   ];
 *   <PageMessages messages={messages} />
 */
export function PageMessages({ messages, className }: PageMessagesProps) {
  const visible = messages.filter((m) => m.show);

  if (visible.length === 0) return null;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {visible.map(({ key, message, variant, title }) => (
        <Alert
          key={key}
          variant={variant === "error" ? "destructive" : "default"}
          className={cn(variantClasses[variant])}
        >
          {title && <AlertTitle>{title}</AlertTitle>}
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
