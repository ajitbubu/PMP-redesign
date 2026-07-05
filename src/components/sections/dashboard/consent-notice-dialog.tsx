"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { consentNotice } from "@/lib/data/consent-notice";

export function ConsentNoticeDialog() {
  const [open, setOpen] = useState(true);
  const [checked, setChecked] = useState<boolean[]>(
    consentNotice.acknowledgements.map(() => false),
  );

  const allChecked = checked.every(Boolean);

  function toggle(index: number, value: boolean) {
    setChecked((prev) => prev.map((item, i) => (i === index ? value : item)));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showClose className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{consentNotice.title}</DialogTitle>
        </DialogHeader>

        <DialogDescription asChild>
          <div className="max-h-[45vh] space-y-3 overflow-y-auto pr-2 text-sm leading-relaxed text-muted-foreground">
            {consentNotice.intro.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </DialogDescription>

        <div className="space-y-3">
          {consentNotice.acknowledgements.map((acknowledgement, index) => {
            const id = `consent-ack-${index}`;
            return (
              <div key={id} className="flex gap-3">
                <Checkbox
                  id={id}
                  checked={checked[index]}
                  onCheckedChange={(value) => toggle(index, value === true)}
                  className="mt-0.5"
                />
                <Label
                  htmlFor={id}
                  className="items-start text-sm font-normal leading-relaxed text-foreground"
                >
                  {acknowledgement}
                </Label>
              </div>
            );
          })}
        </div>

        <DialogFooter className="border-t border-border pt-4">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Skip for now
          </Button>
          <Button disabled={!allChecked} onClick={() => setOpen(false)}>
            Accept &amp; Continue
          </Button>
        </DialogFooter>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {consentNotice.footerLinks.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-foreground hover:underline">
              {link.label}
            </a>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
