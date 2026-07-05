"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  Trash2,
  Pencil,
  Repeat,
  PauseCircle,
  LogOut,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { RightsKind, RightsRequestType } from "@/lib/types";

const CITIZENSHIP_OPTIONS = ["India", "United States", "United Kingdom", "Germany", "Other"];
const COUNTRY_OPTIONS = ["India", "United States", "United Kingdom", "Germany", "Other"];
const USER_TYPES = ["Employee", "Customer", "Supplier", "Contractor", "Vendor", "Others"] as const;
const RAISING_FOR = ["Self", "Minor (Parent/Guardian)", "Authorised Agent"] as const;

const REQUEST_TYPES: { type: RightsRequestType; label: string; description: string; icon: typeof Eye }[] = [
  { type: "Access", label: "Access", description: "Access to your personal data", icon: Eye },
  { type: "Erasure", label: "Right to be Forgotten", description: "Deletion of your personal data", icon: Trash2 },
  { type: "Rectification", label: "Rectification", description: "Correction of your personal data", icon: Pencil },
  { type: "Portability", label: "Portability", description: "Get a copy of your personal data", icon: Repeat },
  { type: "Restriction", label: "Restrict Processing", description: "Object to automated decisioning", icon: PauseCircle },
  { type: "Opt-Out", label: "Opt-Out", description: "Object to use of your data", icon: LogOut },
];

const DECLARATIONS = [
  "I declare, under penalty of perjury, that the information provided is true and accurate.",
  "I understand deleting or restricting my data is irreversible and may result in service termination.",
  "I understand additional verification may be required to complete this request.",
];

type FormState = {
  citizenship: string;
  country: string;
  userType: (typeof USER_TYPES)[number];
  raisingFor: (typeof RAISING_FOR)[number];
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  requestType: RightsRequestType;
  comment: string;
  declarations: boolean[];
};

const EMPTY_FORM: FormState = {
  citizenship: "",
  country: "",
  userType: "Employee",
  raisingFor: "Self",
  firstName: "",
  lastName: "",
  mobile: "",
  email: "",
  requestType: "Access",
  comment: "",
  declarations: [false, false, false],
};

export function SubmitRequestForm({ kind }: { kind: RightsKind }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const idPrefix = kind === "dpar" ? "DPR" : "DSR";
  const allDeclared = form.declarations.every(Boolean);
  const canSubmit =
    form.citizenship &&
    form.country &&
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    allDeclared;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    router.push(`/rights/${kind}?submitted=1`);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-[1400px] flex-col gap-6">
      {/* Subject details */}
      <Card className="p-5 sm:p-6">
        <h2 className="font-display text-lg font-bold text-foreground">Subject details</h2>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="citizenship">
              Citizenship
              <span className="text-destructive"> *<span className="sr-only">(required)</span></span>
            </Label>
            <Select value={form.citizenship} onValueChange={(v) => update("citizenship", v)}>
              <SelectTrigger id="citizenship" aria-required="true">
                <SelectValue placeholder="Select citizenship" />
              </SelectTrigger>
              <SelectContent>
                {CITIZENSHIP_OPTIONS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">
              Country/Region of Residence
              <span className="text-destructive"> *<span className="sr-only">(required)</span></span>
            </Label>
            <Select value={form.country} onValueChange={(v) => update("country", v)}>
              <SelectTrigger id="country" aria-required="true">
                <SelectValue placeholder="Select country/region" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRY_OPTIONS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <Label>
            Choose User Type<span className="text-destructive"> *</span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {USER_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                aria-pressed={form.userType === type}
                onClick={() => update("userType", type)}
                className={cn(
                  "rounded-md border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  form.userType === type
                    ? "border-primary bg-accent text-primary"
                    : "border-border bg-card text-foreground hover:bg-secondary",
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <Label>
            I am raising for/as<span className="text-destructive"> *</span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {RAISING_FOR.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={form.raisingFor === option}
                onClick={() => update("raisingFor", option)}
                className={cn(
                  "rounded-md border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  form.raisingFor === option
                    ? "border-primary bg-accent text-primary"
                    : "border-border bg-card text-foreground hover:bg-secondary",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="first-name">
              First name<span className="text-destructive"> *</span>
            </Label>
            <Input
              id="first-name"
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last-name">
              Last name<span className="text-destructive"> *</span>
            </Label>
            <Input
              id="last-name"
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile number</Label>
            <Input
              id="mobile"
              type="tel"
              value={form.mobile}
              onChange={(e) => update("mobile", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-email">
              Registered Email ID<span className="text-destructive"> *</span>
            </Label>
            <Input
              id="reg-email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </div>
        </div>
      </Card>

      {/* Type of request */}
      <Card className="p-5 sm:p-6">
        <h2 className="font-display text-lg font-bold text-foreground">Type of request</h2>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {REQUEST_TYPES.map(({ type, label, description, icon: Icon }) => {
            const selected = form.requestType === type;
            return (
              <button
                key={type}
                type="button"
                aria-pressed={selected}
                onClick={() => update("requestType", type)}
                className={cn(
                  "flex flex-col gap-3 rounded-lg border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  selected ? "border-primary bg-accent" : "border-border bg-card hover:bg-secondary/60",
                )}
              >
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-md",
                    selected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
                  )}
                >
                  <Icon className="size-4.5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold text-foreground">{label}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{description}</span>
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Additional context */}
      <Card className="p-5 sm:p-6">
        <h2 className="font-display text-lg font-bold text-foreground">Additional context</h2>

        <div className="mt-5 space-y-2">
          <Label htmlFor="supporting-doc">Supporting Document (optional)</Label>
          <label
            htmlFor="supporting-doc"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary/30 px-6 py-10 text-center transition-colors hover:bg-secondary/50"
          >
            <Upload className="size-5 text-primary" aria-hidden="true" />
            <span className="font-semibold text-foreground">Click to upload or drag &amp; drop</span>
            <span className="text-xs text-muted-foreground">JPG, PNG, PDF — max 5 MB</span>
            <input
              id="supporting-doc"
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              className="sr-only"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
            />
          </label>
          {fileName ? <p className="text-sm text-muted-foreground">Selected: {fileName}</p> : null}
        </div>

        <div className="mt-5 space-y-2">
          <Label htmlFor="comment">Comment (Optional)</Label>
          <textarea
            id="comment"
            rows={4}
            value={form.comment}
            onChange={(e) => update("comment", e.target.value)}
            placeholder="Add any additional context..."
            className="w-full rounded-md border border-input bg-card px-3.5 py-2.5 text-base text-foreground shadow-xs placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>
      </Card>

      {/* Declarations */}
      <Card className="p-5 sm:p-6">
        <h2 className="font-display text-lg font-bold text-foreground">Declarations</h2>
        <p className="mt-1 text-sm text-muted-foreground">All three are required to submit.</p>
        {!allDeclared ? (
          <p
            id="declarations-error"
            role="alert"
            className="mt-1 text-sm font-medium text-destructive"
          >
            Please accept all declarations to proceed
          </p>
        ) : null}

        <div
          className="mt-4 space-y-3"
          role="group"
          aria-label="Declarations"
          aria-describedby={!allDeclared ? "declarations-error" : undefined}
        >
          {DECLARATIONS.map((text, index) => (
            <label key={text} className="flex items-start gap-3 text-sm text-foreground">
              <Checkbox
                checked={form.declarations[index]}
                onCheckedChange={(checked) =>
                  setForm((prev) => {
                    const next = [...prev.declarations];
                    next[index] = checked === true;
                    return { ...prev, declarations: next };
                  })
                }
                className="mt-0.5"
              />
              {text}
            </label>
          ))}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => setForm(EMPTY_FORM)}>
            Reset Form
          </Button>
          <Button type="submit" disabled={!canSubmit || submitting}>
            {submitting ? "Submitting…" : "Submit Request"}
          </Button>
        </div>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        {idPrefix} requests are mock in this build — submitting shows a success toast on the request
        list, but no request is persisted (no shared client store yet).
      </p>
    </form>
  );
}
