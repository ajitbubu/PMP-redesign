"use client";

import * as React from "react";
import { Calendar, ChevronDown, Globe } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProfileField } from "@/lib/types";
import { userProfile } from "@/lib/data/profile";
import { SensitiveField } from "./sensitive-field";

function RequiredMark() {
  return (
    <span className="text-destructive">
      *<span className="sr-only"> (required)</span>
    </span>
  );
}

function FieldRow({ field }: { field: ProfileField }) {
  if (field.sensitive) {
    return (
      <SensitiveField label={field.label} value={field.value} required={field.required} />
    );
  }

  const isEmpty = field.value.trim() === "";

  // Empty optional field → "+ Add" affordance instead of a bare box (design-review T10).
  if (isEmpty && !field.required) {
    return (
      <div className="flex flex-col gap-1.5">
        <Label>{field.label}</Label>
        <button
          type="button"
          className="inline-flex h-11 items-center text-sm font-medium text-primary transition-colors hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          + Add {field.label}
        </button>
      </div>
    );
  }

  const TrailingIcon =
    field.kind === "date" ? Calendar : field.kind === "select" ? ChevronDown : null;

  return (
    <div className="flex flex-col gap-1.5">
      <Label>
        {field.label}
        {field.required ? <RequiredMark /> : null}
      </Label>
      <div className="flex h-11 items-center justify-between gap-2 rounded-md border border-input bg-secondary/60 px-3.5 text-foreground">
        <span className="truncate">{field.value}</span>
        {TrailingIcon ? (
          <TrailingIcon className="size-4 shrink-0 text-muted-foreground" />
        ) : null}
      </div>
    </div>
  );
}

function Section({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-8 border-b border-border py-8 last:border-b-0 lg:grid-cols-[280px_1fr]">
      <div>
        <h2 className="font-semibold text-foreground">{label}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

const LANGUAGES = ["English", "Hindi", "Spanish", "German"] as const;

export function ProfileForm() {
  return (
    <Card className="px-6 sm:px-8">
      {/* Profile */}
      <Section
        label="Profile"
        description="Your personal information and account security settings."
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage src={userProfile.avatarUrl} alt="" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-display text-xl font-bold text-foreground">
                {userProfile.fullName}
              </p>
              <p className="text-sm text-muted-foreground">User ID: {userProfile.userId}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {userProfile.identity.map((field) => (
              <FieldRow key={field.label} field={field} />
            ))}
          </div>
        </div>
      </Section>

      {/* Guardian Details */}
      <Section label="Guardian Details" description="Your information regarding guardian.">
        <div className="grid gap-4 sm:grid-cols-2">
          {userProfile.guardian.map((field) => (
            <FieldRow key={field.label} field={field} />
          ))}
        </div>
      </Section>

      {/* Language & Region */}
      <Section
        label="Language & Region"
        description="Customize your language and region."
      >
        <div className="flex max-w-sm flex-col gap-1.5">
          <Label htmlFor="profile-language">
            Language
            <RequiredMark />
          </Label>
          <Select defaultValue={userProfile.language}>
            <SelectTrigger id="profile-language" aria-required="true">
              <span className="flex items-center gap-2">
                <Globe className="size-4 shrink-0 text-muted-foreground" />
                <SelectValue />
              </span>
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Section>
    </Card>
  );
}
