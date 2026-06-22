# @conga-cloud/design-system — Component Reference

All exports available from `@conga-cloud/design-system` as of March 2026.

> **Note:** There is no `PageHeader` export. Custom page headers should be composed from primitives (e.g. `Badge`, `Button`, `Breadcrumb*`, `Separator`) as done in `src/components/ui/page-header.tsx`.

---

## Layout & Structure

| Export | Notes |
|---|---|
| `AspectRatio` | |
| `Card`, `CardContent`, `CardDescription`, `CardFooter`, `CardHeader`, `CardTitle` | |
| `Collapsible`, `CollapsibleContent`, `CollapsibleTrigger` | |
| `ResizableHandle`, `ResizablePanel`, `ResizablePanelGroup` | |
| `ScrollArea`, `ScrollBar` | |
| `Separator` | |
| `Sidebar`, `SidebarContent`, `SidebarFooter`, `SidebarGroup`, `SidebarGroupAction`, `SidebarGroupContent`, `SidebarGroupLabel`, `SidebarHeader`, `SidebarInput`, `SidebarInset` | |
| `SidebarMenu`, `SidebarMenuAction`, `SidebarMenuBadge`, `SidebarMenuButton`, `SidebarMenuItem`, `SidebarMenuSkeleton`, `SidebarMenuSub`, `SidebarMenuSubButton`, `SidebarMenuSubItem` | |
| `SidebarProvider`, `SidebarRail`, `SidebarSeparator`, `SidebarTrigger` | |

---

## Typography & Display

| Export | Notes |
|---|---|
| `Badge` | Type: `BadgeProps` |
| `Alert`, `AlertDescription`, `AlertTitle` | |
| `Avatar`, `AvatarFallback`, `AvatarImage` | |
| `Skeleton` | |
| `Progress` | |

---

## Navigation

| Export | Notes |
|---|---|
| `Breadcrumb`, `BreadcrumbEllipsis`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbList`, `BreadcrumbPage`, `BreadcrumbSeparator` | |
| `NavigationMenu`, `NavigationMenuContent`, `NavigationMenuIndicator`, `NavigationMenuItem`, `NavigationMenuLink`, `NavigationMenuList`, `NavigationMenuTrigger`, `NavigationMenuViewport` | Utility: `navigationMenuTriggerStyle` |
| `Menubar`, `MenubarCheckboxItem`, `MenubarContent`, `MenubarGroup`, `MenubarItem`, `MenubarLabel`, `MenubarMenu`, `MenubarPortal`, `MenubarRadioGroup`, `MenubarRadioItem`, `MenubarSeparator`, `MenubarShortcut`, `MenubarSub`, `MenubarSubContent`, `MenubarSubTrigger`, `MenubarTrigger` | |
| `Pagination`, `PaginationContent`, `PaginationEllipsis`, `PaginationItem`, `PaginationLink`, `PaginationNext`, `PaginationPrevious` | |
| `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger` | |

---

## Forms & Inputs

| Export | Notes |
|---|---|
| `Button` | Types: `ButtonProps`, `buttonVariants` |
| `Input` | Type: `InputProps` |
| `Textarea` | |
| `Label` | |
| `Checkbox` | Type: `CheckboxProps` |
| `RadioGroup`, `RadioGroupItem` | Type: `RadioGroupProps` |
| `Select`, `SelectContent`, `SelectGroup`, `SelectItem`, `SelectLabel`, `SelectScrollDownButton`, `SelectScrollUpButton`, `SelectSeparator`, `SelectTrigger`, `SelectValue` | |
| `Slider` | |
| `Switch` | |
| `Toggle`, `ToggleGroup`, `ToggleGroupItem` | Utility: `toggleVariants` |
| `InputOTP`, `InputOTPGroup`, `InputOTPSeparator`, `InputOTPSlot` | |
| `Form`, `FormControl`, `FormDescription`, `FormField`, `FormItem`, `FormLabel`, `FormMessage` | Hook: `useFormField` |
| `Calendar` | Type: `CalendarProps` |

---

## Overlays & Feedback

| Export | Notes |
|---|---|
| `Dialog`, `DialogClose`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogOverlay`, `DialogPortal`, `DialogTitle`, `DialogTrigger` | |
| `AlertDialog`, `AlertDialogAction`, `AlertDialogCancel`, `AlertDialogContent`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogHeader`, `AlertDialogOverlay`, `AlertDialogPortal`, `AlertDialogTitle`, `AlertDialogTrigger` | |
| `Sheet`, `SheetClose`, `SheetContent`, `SheetDescription`, `SheetFooter`, `SheetHeader`, `SheetOverlay`, `SheetPortal`, `SheetTitle`, `SheetTrigger` | |
| `Drawer`, `DrawerClose`, `DrawerContent`, `DrawerDescription`, `DrawerFooter`, `DrawerHeader`, `DrawerOverlay`, `DrawerPortal`, `DrawerTitle`, `DrawerTrigger` | |
| `Popover`, `PopoverContent`, `PopoverTrigger` | |
| `HoverCard`, `HoverCardContent`, `HoverCardTrigger` | |
| `Tooltip`, `TooltipContent`, `TooltipProvider`, `TooltipTrigger` | |
| `Toast`, `ToastAction`, `ToastClose`, `ToastDescription`, `ToastProvider`, `ToastTitle`, `ToastViewport`, `Toaster` | Types: `ToastProps`, `ToastActionElement` — Hook: `useToast` — Fn: `toast` |
| `SonnerComponents` | Re-export of `sonner` |

---

## Menus & Commands

| Export | Notes |
|---|---|
| `DropdownMenu`, `DropdownMenuCheckboxItem`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuItem`, `DropdownMenuLabel`, `DropdownMenuPortal`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuSeparator`, `DropdownMenuShortcut`, `DropdownMenuSub`, `DropdownMenuSubContent`, `DropdownMenuSubTrigger`, `DropdownMenuTrigger` | |
| `ContextMenu`, `ContextMenuCheckboxItem`, `ContextMenuContent`, `ContextMenuGroup`, `ContextMenuItem`, `ContextMenuLabel`, `ContextMenuPortal`, `ContextMenuRadioGroup`, `ContextMenuRadioItem`, `ContextMenuSeparator`, `ContextMenuShortcut`, `ContextMenuSub`, `ContextMenuSubContent`, `ContextMenuSubTrigger`, `ContextMenuTrigger` | |
| `Command`, `CommandDialog`, `CommandEmpty`, `CommandGroup`, `CommandInput`, `CommandItem`, `CommandList`, `CommandSeparator`, `CommandShortcut` | |

---

## Data Display

| Export | Notes |
|---|---|
| `Table`, `TableBody`, `TableCaption`, `TableCell`, `TableFooter`, `TableHead`, `TableHeader`, `TableRow` | |
| `Accordion`, `AccordionContent`, `AccordionItem`, `AccordionTrigger` | |
| `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselNext`, `CarouselPrevious` | Type: `CarouselApi` |
| `ChartContainer`, `ChartLegend`, `ChartLegendContent`, `ChartStyle`, `ChartTooltip`, `ChartTooltipContent` | Type: `ChartConfig` |

---

## Utilities & Hooks

| Export | Type | Notes |
|---|---|---|
| `cn` | Function | Tailwind class merge utility (`clsx` + `tailwind-merge`) |
| `navigationMenuTriggerStyle` | Function | Style helper for nav menu triggers |
| `buttonVariants` | Function | CVA variant helper for Button |
| `toggleVariants` | Function | CVA variant helper for Toggle |
| `useFormField` | Hook | Used internally by Form components |
| `useIsMobile` | Hook | Breakpoint detection |
| `useSidebar` | Hook | Sidebar state management |
| `useToast` | Hook | Programmatic toast access |
| `toast` | Function | Imperative toast trigger |
| `reducer` | Function | Toast state reducer |
