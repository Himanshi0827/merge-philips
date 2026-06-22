"use client";

import { useState } from "react";
import {
  Card, CardContent, CardHeader, CardTitle,
  Checkbox,
  Input,
  Label,
  Popover, PopoverContent, PopoverTrigger,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  Textarea,
  Button,
} from "@conga-cloud/design-system";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import type { FieldConfig } from "@/lib/layouts/quote.layout";
import type { ObjectMetadata } from "@/lib/api";
import {
  buildOrgFormatConfig,
  formatDate,
  formatCurrencyAmount,
  type OrgFormatConfig,
} from "@/lib/formatting";

// ─── Props ────────────────────────────────────────────────────────────────────

interface TwoColumnSectionProps {
  title: string;
  leftFields: FieldConfig[];
  rightFields: FieldConfig[];
  /** The record data — any key/value shape (typed or untyped fields). */
  data: Record<string, unknown>;
  metadata: ObjectMetadata;
  /** Org-aware format config (locale, timezone, currency). Falls back to browser defaults. */
  orgFormat?: OrgFormatConfig;
  // ── Edit mode ──────────────────────────────────────────────────────────────
  /** When true the section switches to edit mode for `editable` fields. */
  isEditing?: boolean;
  /** Draft values map — only changed fields (fieldName → new value). */
  editValues?: Record<string, unknown>;
  /**
   * Called on every field change.
   * `error` is the result of the field's `validate()` function (null = valid).
   */
  onFieldChange?: (fieldName: string, value: unknown, error: string | null) => void;
  /** Validation error messages keyed by fieldName. */
  fieldErrors?: Record<string, string>;
}

// ─── Display value helper ─────────────────────────────────────────────────────

function getFieldDisplayValue(
  data: Record<string, unknown>,
  fieldName: string,
  orgFormat: OrgFormatConfig,
): string {
  const raw = data[fieldName];
  if (raw == null) return "—";

  if (typeof raw === "object" && raw !== null) {
    if ("Name" in raw) return String((raw as { Name: unknown }).Name ?? "—");
    if ("Value" in raw && typeof (raw as { Value: unknown }).Value === "number") {
      return formatCurrencyAmount((raw as { Value: number }).Value, orgFormat.currency, orgFormat);
    }
  }

  if (typeof raw === "boolean") return raw ? "Yes" : "No";

  if (typeof raw === "string" && /^\d{4}-\d{2}-\d{2}/.test(raw)) {
    return formatDate(raw, orgFormat);
  }

  return String(raw);
}

// ─── Metadata-driven field resolution ────────────────────────────────────────

/**
 * DataTypes that are always display-only regardless of WriteAccess.
 * Lookup: no picker implemented. Currency/Rollup: computed values.
 * AutoNumber: system-assigned. MultiPicklist: multi-select not yet supported.
 */
const NON_EDITABLE_DATA_TYPES = new Set([
  "Lookup", "Currency", "AutoNumber", "Rollup", "MultiPicklist",
]);

function deriveFieldType(dataType: string): FieldConfig["fieldType"] {
  switch (dataType) {
    case "String":    return "text";
    case "LongString": return "textarea";
    case "Boolean":   return "boolean";
    case "Date":
    case "DateTime":  return "date";
    case "Double":
    case "Integer":   return "number";
    case "Picklist":  return "picklist";
    case "Currency":  return "currency";
    default:          return "text";
  }
}

interface ResolvedFieldConfig {
  editable: boolean;
  fieldType: FieldConfig["fieldType"];
  picklistName: string | undefined;
  required: boolean;
  validate: FieldConfig["validate"];
}

/**
 * Derives effective field config from live metadata.
 * Values explicitly set in FieldConfig always win (override).
 * Falls back to metadata-driven defaults for unset properties.
 */
function resolveFieldConfig(field: FieldConfig, metadata: ObjectMetadata): ResolvedFieldConfig {
  const meta = metadata.FieldMetadata.find((f) => f.FieldName === field.fieldName);

  const metaEditable =
    meta != null &&
    meta.WriteAccess === true &&
    !NON_EDITABLE_DATA_TYPES.has(meta.DataType);

  return {
    editable:     field.editable     ?? metaEditable,
    fieldType:    field.fieldType    ?? (meta ? deriveFieldType(meta.DataType) : "text"),
    picklistName: field.picklistName ?? (meta?.PicklistName ?? undefined),
    required:     field.required     ?? (meta?.IsRequired ?? false),
    validate:     field.validate,
  };
}

// ─── Edit input sub-components ────────────────────────────────────────────────

/** Formats a Date as YYYY-MM-DD in local time (avoids UTC-offset day shifts). */
function toYMD(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function DatePickerInput({
  value,
  onChange,
}: {
  value: string | null | undefined;
  onChange: (iso: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const parsed = value ? new Date(value + "T00:00:00") : undefined;
  const display = parsed
    ? parsed.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
    : "Pick a date";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-8 text-sm",
            !value && "text-muted-foreground",
          )}
        >
          {display}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={parsed}
          onSelect={(day) => {
            onChange(day ? toYMD(day) : null);
            setOpen(false);
          }}
          autoFocus
        />
        <div className="flex items-center justify-between border-t px-3 py-2 gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => {
              onChange(toYMD(new Date()));
              setOpen(false);
            }}
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-muted-foreground"
            disabled={!value}
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
          >
            Clear
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function PicklistInput({
  value,
  picklistName,
  required,
  metadata,
  onChange,
}: {
  value: unknown;
  picklistName?: string;
  required?: boolean;
  metadata: ObjectMetadata;
  onChange: (v: string) => void;
}) {
  const entries = picklistName
    ? (metadata.PicklistMetadata.find((p) => p.Name === picklistName)?.PicklistEntries ?? [])
    : [];
  // Filter out deprecated entries, then sort by Sequence
  const options = entries
    .filter((e) => !e.IsDeprecated)
    .sort((a, b) => a.Sequence - b.Sequence);

  if (options.length === 0) {
    // No picklist metadata — fall back to plain text input
    return (
      <Input
        className="h-8 text-sm"
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  const CLEAR_VALUE = "__CLEAR__";

  return (
    <Select
      value={typeof value === "string" ? value : ""}
      onValueChange={(v) => onChange(v === CLEAR_VALUE ? "" : v)}
    >
      <SelectTrigger className="h-8 text-sm">
        <SelectValue placeholder="Select…" />
      </SelectTrigger>
      <SelectContent>
        {!required && (
          <SelectItem value={CLEAR_VALUE}>
            <span className="text-muted-foreground italic">— None —</span>
          </SelectItem>
        )}
        {options.map((opt) => (
          <SelectItem key={opt.Value} value={opt.Value}>
            {opt.DisplayText}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ─── EditableFieldInput — switches on fieldType ───────────────────────────────

function EditableFieldInput({
  field,
  currentValue,
  metadata,
  onChange,
}: {
  field: FieldConfig;
  currentValue: unknown;
  metadata: ObjectMetadata;
  onChange: (v: unknown) => void;
}) {
  const type = field.fieldType ?? "text";

  if (type === "boolean") {
    return (
      <div className="flex items-center gap-2 h-8">
        <Checkbox
          id={field.fieldName}
          checked={Boolean(currentValue)}
          onCheckedChange={(checked) => onChange(Boolean(checked))}
        />
        <Label htmlFor={field.fieldName} className="text-sm font-normal cursor-pointer">
          {Boolean(currentValue) ? "Yes" : "No"}
        </Label>
      </div>
    );
  }

  if (type === "date") {
    return (
      <DatePickerInput
        value={typeof currentValue === "string" ? currentValue : null}
        onChange={onChange}
      />
    );
  }

  if (type === "picklist") {
    return (
      <PicklistInput
        value={currentValue}
        picklistName={field.picklistName}
        required={field.required}
        metadata={metadata}
        onChange={onChange}
      />
    );
  }

  if (type === "textarea") {
    return (
      <Textarea
        className="text-sm min-h-[60px] resize-y"
        value={typeof currentValue === "string" ? currentValue : ""}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (type === "number" || type === "currency") {
    return (
      <Input
        type="number"
        className="h-8 text-sm"
        value={typeof currentValue === "number" ? String(currentValue) : ""}
        onChange={(e) =>
          onChange(e.target.value === "" ? null : Number(e.target.value))
        }
      />
    );
  }

  // Default: text
  return (
    <Input
      type="text"
      className="h-8 text-sm"
      value={typeof currentValue === "string" ? currentValue : ""}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

// ─── FieldRow ─────────────────────────────────────────────────────────────────

function FieldRow({
  field,
  data,
  metadata,
  orgFormat,
  isEditing,
  editValues,
  onFieldChange,
  fieldErrors,
}: {
  field: FieldConfig;
  data: Record<string, unknown>;
  metadata: ObjectMetadata;
  orgFormat: OrgFormatConfig;
  isEditing: boolean;
  editValues: Record<string, unknown>;
  onFieldChange: (fieldName: string, value: unknown, error: string | null) => void;
  fieldErrors: Record<string, string>;
}) {
  const metaEntry = metadata.FieldMetadata.find((f) => f.FieldName === field.fieldName);
  const inMetadata = !!metaEntry;
  const label = metaEntry?.DisplayName ?? field.label;
  const resolved = resolveFieldConfig(field, metadata);
  const savedValue = data[field.fieldName];

  // In edit mode, prefer the draft value if the field has been touched
  const currentValue =
    isEditing && field.fieldName in editValues
      ? editValues[field.fieldName]
      : savedValue;

  const isDirty = isEditing && field.fieldName in editValues;
  const error = fieldErrors[field.fieldName];
  const showEditInput = isEditing && resolved.editable;

  // Merge resolved config back into a synthetic FieldConfig for EditableFieldInput
  const resolvedField: FieldConfig = {
    ...field,
    editable:     resolved.editable,
    fieldType:    resolved.fieldType,
    picklistName: resolved.picklistName,
    required:     resolved.required,
  };

  return (
    <div
      className={cn(
        "px-6 py-3",
        isDirty && "border-l-2 border-l-blue-500",
      )}
    >
      <dt className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1">
        {label}
        {resolved.required && <span className="text-destructive" aria-hidden>*</span>}
        {!inMetadata && (
          <span
            className="h-2 w-2 rounded-full bg-amber-400 shrink-0"
            title={`"${field.fieldName}" not found in metadata`}
          />
        )}
      </dt>

      {showEditInput ? (
        <dd>
          <EditableFieldInput
            field={resolvedField}
            currentValue={currentValue}
            metadata={metadata}
            onChange={(value) => {
              const err = resolved.validate ? resolved.validate(value) : null;
              onFieldChange(field.fieldName, value, err);
            }}
          />
          {error && (
            <p className="text-destructive text-xs mt-1" role="alert">
              {error}
            </p>
          )}
        </dd>
      ) : (
        <dd
          className={cn(
            "text-sm mt-0.5 font-medium",
            !inMetadata && "text-muted-foreground/50 italic font-normal",
            isEditing && !resolved.editable && inMetadata && "text-muted-foreground",
          )}
        >
          {!inMetadata
            ? "Not available"
            : getFieldDisplayValue(data, field.fieldName, orgFormat)}
        </dd>
      )}
    </div>
  );
}

// ─── TwoColumnSection ─────────────────────────────────────────────────────────

export function TwoColumnSection({
  title,
  leftFields,
  rightFields,
  data,
  metadata,
  orgFormat: orgFormatProp,
  isEditing = false,
  editValues = {},
  onFieldChange = () => {},
  fieldErrors = {},
}: TwoColumnSectionProps) {
  const orgFormat = orgFormatProp ?? buildOrgFormatConfig();
  const rowCount = Math.max(leftFields.length, rightFields.length);
  const interleavedFields = Array.from({ length: rowCount }, (_, i) =>
    [leftFields[i], rightFields[i]].filter(Boolean),
  ).flat() as FieldConfig[];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 [&>*]:sm:border-b [&>*:nth-child(odd)]:sm:border-r">
          {interleavedFields.map((field) => (
            <FieldRow
              key={field.fieldName}
              field={field}
              data={data}
              metadata={metadata}
              orgFormat={orgFormat}
              isEditing={isEditing}
              editValues={editValues}
              onFieldChange={onFieldChange}
              fieldErrors={fieldErrors}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
