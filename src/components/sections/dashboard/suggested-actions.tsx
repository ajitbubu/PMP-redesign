import Link from "next/link";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/shared/icon-tile";
import { suggestedActions } from "@/lib/data/dashboard";

export function SuggestedActions() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {suggestedActions.map((action) => (
        <Link key={action.id} href={action.href} className="block">
          <Card className="flex items-center gap-4 p-5 transition-shadow hover:shadow-md">
            <IconTile icon={action.icon} accent={action.accent} soft />
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                {action.category}
              </span>
              <span className="font-semibold text-foreground">{action.title}</span>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
