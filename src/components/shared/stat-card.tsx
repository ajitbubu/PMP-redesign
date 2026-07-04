import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/shared/icon-tile";
import { cn } from "@/lib/utils";
import type { StatTile } from "@/lib/types";

/** KPI stat card — icon tile, delta chip, big number, optional caption/hint. */
export function StatCard({ tile, className }: { tile: StatTile; className?: string }) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between">
        <IconTile icon={tile.icon} accent={tile.accent} />
        {tile.delta ? (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
            <span aria-hidden="true">↗</span> {tile.delta}
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {tile.label}
      </p>
      <div className="mt-1 flex items-end gap-2">
        <span className="font-display text-3xl font-bold leading-none text-foreground">
          {tile.value}
        </span>
        {tile.caption ? (
          <span className="pb-0.5 text-xs font-medium uppercase text-muted-foreground">
            {tile.caption}
          </span>
        ) : null}
      </div>
      {tile.hint ? <p className="mt-2 text-xs text-muted-foreground">{tile.hint}</p> : null}
    </Card>
  );
}
