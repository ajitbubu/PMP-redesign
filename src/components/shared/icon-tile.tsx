import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { tileAccentClasses, tileAccentSoftClasses } from "@/lib/ui-maps";
import type { TileAccent } from "@/lib/types";

export function IconTile({
  icon: Icon,
  accent,
  soft = false,
  className,
}: {
  icon: LucideIcon;
  accent: TileAccent;
  soft?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-11 items-center justify-center rounded-lg",
        soft ? tileAccentSoftClasses[accent] : tileAccentClasses[accent],
        className,
      )}
    >
      <Icon className="size-5" />
    </span>
  );
}
