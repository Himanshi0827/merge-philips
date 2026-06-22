"use client";

import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

/**
 * Local shadcn-style Calendar built on react-day-picker v9.
 *
 * v9 DOM structure (relevant part):
 *   <div.months>           ← relative positioning anchor
 *     <nav.nav>            ← first child of months (NOT inside month_caption)
 *       <button.button_previous>
 *       <button.button_next>
 *     </nav>
 *     <div.month>
 *       <div.month_caption> ← shows label or dropdowns
 *       <table.month_grid>
 *   </div.months>
 *
 * The nav is absolutely positioned over the caption row so the arrows and
 * dropdowns appear on the same line. pointer-events-none on the nav overlay
 * ensures the dropdown <select> elements beneath remain clickable.
 */
export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "dropdown",
  ...props
}: CalendarProps) {
  const currentYear = new Date().getFullYear();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      startMonth={new Date(currentYear - 10, 0)}
      endMonth={new Date(currentYear + 10, 11)}
      className={cn("p-3", className)}
      classNames={{
        // months is the positioning context for the absolutely-placed nav
        months: "relative flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-4",
        // caption row — same height as nav buttons so they align vertically
        month_caption: "flex h-7 items-center justify-center",
        // Used both as the visible overlay span inside Dropdown AND as the standalone label in non-dropdown mode
        caption_label: "inline-flex items-center gap-1 text-sm font-medium px-2 h-7 rounded-md border border-input bg-background hover:bg-accent cursor-pointer select-none",
        // nav overlays the caption row; pointer-events-none prevents blocking
        // the dropdown <select> elements underneath
        nav: "absolute top-0 inset-x-0 z-10 flex h-7 items-center justify-between px-1 pointer-events-none",
        button_previous: cn(
          "pointer-events-auto h-7 w-7 rounded-md border border-input bg-transparent p-0",
          "inline-flex items-center justify-center opacity-50 hover:opacity-100",
          "hover:bg-accent transition-opacity",
        ),
        button_next: cn(
          "pointer-events-auto h-7 w-7 rounded-md border border-input bg-transparent p-0",
          "inline-flex items-center justify-center opacity-50 hover:opacity-100",
          "hover:bg-accent transition-opacity",
        ),
        // dropdown layout (captionLayout="dropdown")
        // The Dropdown component renders: <span.dropdown_root> <select.dropdown> <span.caption_label aria-hidden> </span.dropdown_root>
        // The native select is made transparent and absolutely overlaid on the visible caption_label span.
        dropdowns: "flex items-center gap-2",
        dropdown_root: "relative inline-flex items-center",
        // Transparent native <select> overlaid on top of the visible caption_label span — full coverage so it's fully clickable
        dropdown: "absolute inset-0 h-full w-full cursor-pointer opacity-0 z-10",
        months_dropdown: "",
        years_dropdown: "",
        // grid
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-9 text-center text-[0.8rem] font-normal text-muted-foreground",
        week: "flex w-full mt-2",
        day: "relative h-9 w-9 p-0 text-center text-sm focus-within:relative focus-within:z-20",
        day_button: cn(
          "h-9 w-9 rounded-md p-0 font-normal",
          "hover:bg-accent hover:text-accent-foreground",
          "aria-selected:opacity-100",
        ),
        selected: "rounded-md bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        today: "rounded-md bg-accent text-accent-foreground",
        outside: "text-muted-foreground opacity-50",
        disabled: "text-muted-foreground opacity-50",
        range_start: "rounded-l-md",
        range_end: "rounded-r-md",
        range_middle: "rounded-none aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left")
            return (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m15 18-6-6 6-6" />
              </svg>
            );
          if (orientation === "down")
            return (
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m6 9 6 6 6-6" />
              </svg>
            );
          if (orientation === "up")
            return (
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m18 15-6-6-6 6" />
              </svg>
            );
          // right
          return (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m9 18 6-6-6-6" />
            </svg>
          );
        },
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";
