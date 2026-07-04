"use client";

import { History } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { getAuditLog } from "@/lib/data/audit-log";

export function AuditLogDrawer({
  open,
  onOpenChange,
  itemName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
}) {
  const entries = getAuditLog();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <History className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <SheetTitle>Audit Log</SheetTitle>
              <SheetDescription className="truncate">{itemName}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <ol className="flex-1 space-y-6 overflow-y-auto border-l border-border py-1 pl-6">
          {entries.map((entry) => (
            <li key={entry.id} className="relative">
              <span className="absolute -left-[1.6rem] top-1 size-2.5 rounded-full bg-primary ring-4 ring-popover" />
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-foreground">{entry.actor}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{entry.timeLabel}</span>
              </div>
              <p className="mt-0.5 text-sm font-medium text-primary">{entry.action}</p>
              <div className="mt-2 space-y-2 rounded-lg bg-secondary/50 p-3 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    From
                  </p>
                  <p className="text-foreground">{entry.from}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">To</p>
                  <p className="text-foreground">{entry.to}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <Button type="button" className="w-full" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      </SheetContent>
    </Sheet>
  );
}
