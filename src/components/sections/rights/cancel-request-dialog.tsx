"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { RightsRequest } from "@/lib/types";

/** Confirmation dialog for withdrawing an in-flight rights request. */
export function CancelRequestDialog({
  request,
  open,
  onOpenChange,
  onConfirm,
}: {
  request: RightsRequest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Request {request.id}?</DialogTitle>
          <DialogDescription>
            Your change request and its associated request is currently being processed and
            will be completed within 30 days from the date of submission. If you wish to
            withdraw this request or make further changes, please use the button below and
            submit a new request.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Go Back
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Withdraw Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
