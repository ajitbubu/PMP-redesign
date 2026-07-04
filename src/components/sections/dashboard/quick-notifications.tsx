import { Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/shared/icon-tile";
import { quickNotifications } from "@/lib/data/dashboard";

export function QuickNotifications() {
  return (
    <div className="flex flex-col gap-3">
      {quickNotifications.map((notification) => (
        <Card key={notification.id} className="flex items-center gap-4 p-4">
          <IconTile icon={Bell} accent="info" soft />
          <div className="flex flex-col">
            <span className="font-bold text-foreground">{notification.title}</span>
            <span className="text-sm text-muted-foreground">{notification.body}</span>
          </div>
          <span className="ml-auto text-xs text-muted-foreground">
            {notification.timeLabel}
          </span>
        </Card>
      ))}
    </div>
  );
}
