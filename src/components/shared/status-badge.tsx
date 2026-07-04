import { Badge } from "@/components/ui/badge";
import { statusBadgeVariant } from "@/lib/ui-maps";

/** Renders a status string as a semantically-coloured pill. */
export function StatusBadge({ status }: { status: string }) {
  return <Badge variant={statusBadgeVariant(status)}>{status}</Badge>;
}
