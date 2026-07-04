"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function CaptchaField() {
  const [verified, setVerified] = useState(false);

  return (
    <div className="space-y-2">
      {/* Group heading — a plain span, not a <label>, so it doesn't compete
          with the checkbox's own label for the same control. */}
      <span className="flex items-center gap-1 text-sm font-medium leading-none text-foreground">
        Verification
        <span className="text-destructive">*</span>
      </span>
      <div className="flex items-center gap-3 rounded-md border border-border p-4">
        <Checkbox
          id="human-verify"
          checked={verified}
          onCheckedChange={(checked) => setVerified(checked === true)}
        />
        <Label htmlFor="human-verify" className="font-normal">
          Verify you are human
        </Label>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="size-4" />
          Protected by Turnstile
        </span>
      </div>
    </div>
  );
}
