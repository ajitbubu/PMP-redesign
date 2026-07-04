"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type ConsentStatusFilter = "All" | "Active" | "Expiring Soon";
export type ConsentPurposeFilter =
  | "All"
  | "Legal Obligation"
  | "Legitimate Interest"
  | "Contractual Obligation";
export type ConsentStateFilter = "All" | "Opt-in" | "Opt-out" | "Explicit";
export type ConsentPreferenceFilter =
  | "All"
  | "SMS"
  | "WhatsApp"
  | "Phone Call"
  | "In-app message"
  | "Push Notification";

export interface ConsentPanelFilters {
  status: ConsentStatusFilter;
  purpose: ConsentPurposeFilter;
  consentState: ConsentStateFilter;
  preference: ConsentPreferenceFilter;
}

export const defaultConsentPanelFilters: ConsentPanelFilters = {
  status: "All",
  purpose: "All",
  consentState: "All",
  preference: "All",
};

const STATUS_OPTIONS: ConsentStatusFilter[] = ["All", "Active", "Expiring Soon"];
const PURPOSE_OPTIONS: ConsentPurposeFilter[] = [
  "All",
  "Legal Obligation",
  "Legitimate Interest",
  "Contractual Obligation",
];
const STATE_OPTIONS: ConsentStateFilter[] = ["All", "Opt-in", "Opt-out", "Explicit"];
const PREFERENCE_OPTIONS: ConsentPreferenceFilter[] = [
  "All",
  "SMS",
  "WhatsApp",
  "Phone Call",
  "In-app message",
  "Push Notification",
];

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected ? "true" : "false"}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        selected
          ? "border-transparent bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:bg-secondary",
      )}
    >
      {label}
    </button>
  );
}

function ChipGroup<T extends string>({
  legend,
  options,
  value,
  onSelect,
}: {
  legend: string;
  options: readonly T[];
  value: T;
  onSelect: (next: T) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Chip
            key={option}
            label={option}
            selected={value === option}
            onClick={() => onSelect(option)}
          />
        ))}
      </div>
    </fieldset>
  );
}

export function ConsentFilterPanel({
  filters,
  onChange,
  onReset,
}: {
  filters: ConsentPanelFilters;
  onChange: (next: ConsentPanelFilters) => void;
  onReset: () => void;
}) {
  return (
    <Card className="mt-4 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-foreground">Filters</h3>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-primary hover:underline"
        >
          Reset
        </button>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <ChipGroup
          legend="Status"
          options={STATUS_OPTIONS}
          value={filters.status}
          onSelect={(status) => onChange({ ...filters, status })}
        />
        <ChipGroup
          legend="Purpose"
          options={PURPOSE_OPTIONS}
          value={filters.purpose}
          onSelect={(purpose) => onChange({ ...filters, purpose })}
        />
        <ChipGroup
          legend="Consent State"
          options={STATE_OPTIONS}
          value={filters.consentState}
          onSelect={(consentState) => onChange({ ...filters, consentState })}
        />
        <ChipGroup
          legend="Preference"
          options={PREFERENCE_OPTIONS}
          value={filters.preference}
          onSelect={(preference) => onChange({ ...filters, preference })}
        />
      </div>
    </Card>
  );
}
