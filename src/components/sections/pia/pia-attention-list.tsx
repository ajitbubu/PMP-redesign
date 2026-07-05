import { IconTile } from "@/components/shared/icon-tile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { piaAttention } from "@/lib/data/pia";
import type { PiaAttentionItem } from "@/lib/types";

type Tone = PiaAttentionItem["badge"]["tone"];

const toneBadgeVariant: Record<Tone, "destructive" | "warning" | "info"> = {
  danger: "destructive",
  warning: "warning",
  info: "info",
};

const toneBarClass: Record<Tone, string> = {
  danger: "bg-destructive",
  warning: "bg-warning",
  info: "bg-primary",
};

export function PiaAttentionList() {
  return (
    <div className="divide-y border-border">
      {piaAttention.map((item) => (
        <div key={item.id} className="flex items-center gap-4 py-4">
          <IconTile icon={item.icon} accent={item.iconAccent} soft />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-foreground">{item.name}</span>
              <Badge variant={toneBadgeVariant[item.badge.tone]}>{item.badge.label}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
          </div>
          <div className="hidden w-40 md:block">
            <div
              className="h-1.5 rounded-full bg-secondary"
              role="progressbar"
              aria-valuenow={item.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${item.name} progress`}
            >
              <div
                className={`h-1.5 rounded-full ${toneBarClass[item.badge.tone]}`}
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>
          <Button variant={item.action === "Resume" ? "default" : "outline"}>
            {item.action}
          </Button>
        </div>
      ))}
    </div>
  );
}
