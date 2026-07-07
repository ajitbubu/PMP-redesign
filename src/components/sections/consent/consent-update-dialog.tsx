"use client";

import { useState } from "react";
import { TriangleAlert, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ConsentRecord } from "@/lib/types";

const COOLDOWN_SECONDS = 25;

function permissionLabel(optIn: boolean) {
  return optIn ? "Opt-In" : "Opt-Out";
}

/**
 * "Consent Update Required" confirmation for a legal consent permission change.
 * Shows the Opt-In ⇄ Opt-Out transition, captures an optional reason for the
 * audit record, and warns about the post-confirm cooldown.
 */
export function ConsentUpdateDialog({
  record,
  nextPermission,
  open,
  onOpenChange,
  onConfirm,
}: {
  record: ConsentRecord;
  /** The permission the user is switching TO (true = Opt-In, false = Opt-Out). */
  nextPermission: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (note: string) => void;
}) {
  const [note, setNote] = useState("");
  const isWithdrawal = !nextPermission;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Consent Update Required</DialogTitle>
          <DialogDescription className="font-mono text-xs">
            You are about to modify legal consent records
          </DialogDescription>
        </DialogHeader>

        {/* Cooldown warning */}
        <div className="flex gap-3 rounded-lg border border-yellow-300 bg-yellow-50 p-3.5 text-yellow-900">
          <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <div className="text-sm">
            <p className="font-semibold">Please review before confirming</p>
            <p className="mt-1">
              After you confirm, the Save button will be{" "}
              <strong>locked for {COOLDOWN_SECONDS} seconds</strong> while changes propagate to
              PMP core and downstream systems. This protects the integrity of your audit trail.
            </p>
          </div>
        </div>

        {/* Change preview */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Changes
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-secondary/40 p-3">
            <div className="min-w-0">
              <p className="truncate font-mono text-sm font-medium text-primary">{record.name}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {record.purpose} — {record.description}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2 text-sm font-semibold">
              <span className={cn(!isWithdrawal ? "text-red-600" : "text-green-600")}>
                {permissionLabel(!nextPermission)}
              </span>
              <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
              <span className={cn(nextPermission ? "text-green-600" : "text-red-600")}>
                {permissionLabel(nextPermission)}
              </span>
            </div>
          </div>
        </div>

        {/* Reason / notes */}
        <div>
          <label htmlFor="consent-update-note" className="text-sm font-medium text-foreground">
            {isWithdrawal ? "Reason for withdrawal" : "Notes"}{" "}
            <span className="font-normal text-muted-foreground">
              (optional — added to audit record)
            </span>
          </label>
          <Textarea
            id="consent-update-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder={
              isWithdrawal
                ? "e.g., No longer studying at this institution / Withdrawing under DPDPA Section 6(4)"
                : "e.g., Updated preference / Added new opt-in"
            }
            className="mt-2"
          />
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onConfirm(note.trim())}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
