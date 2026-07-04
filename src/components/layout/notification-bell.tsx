"use client";

import { useMemo, useState } from "react";
import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { notifications } from "@/lib/data/dashboard";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const [unreadOnly, setUnreadOnly] = useState(true);
  const hasUnread = notifications.some((n) => n.unread);

  const visible = useMemo(
    () => (unreadOnly ? notifications.filter((n) => n.unread) : notifications),
    [unreadOnly],
  );

  const groups = useMemo(() => {
    const map = new Map<string, typeof visible>();
    for (const n of visible) {
      const list = map.get(n.group) ?? [];
      list.push(n);
      map.set(n.group, list);
    }
    return Array.from(map.entries());
  }, [visible]);

  return (
    <Popover>
      <PopoverTrigger
        className="relative flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        aria-label={`Notifications${hasUnread ? ", unread" : ""}`}
      >
        <Bell className="size-5" />
        {hasUnread ? (
          <span className="absolute right-2 top-2 size-2 rounded-full bg-success ring-2 ring-card" />
        ) : null}
      </PopoverTrigger>
      <PopoverContent className="w-[min(22rem,calc(100vw-2rem))] p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="font-display text-base font-semibold">Notification</span>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            Only show unread
            <Switch
              checked={unreadOnly}
              onCheckedChange={setUnreadOnly}
              aria-label="Only show unread notifications"
            />
          </label>
        </div>
        <div className="max-h-[22rem] overflow-y-auto p-2">
          {groups.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              You&apos;re all caught up.
            </p>
          ) : (
            groups.map(([group, items]) => (
              <div key={group} className="mb-2">
                <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground">{group}</p>
                <ul className="flex flex-col gap-1.5">
                  {items.map((n) => (
                    <li
                      key={n.id}
                      className="rounded-lg border border-border p-3 transition-colors hover:bg-secondary/50"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground">{n.title}</p>
                        <span className="flex shrink-0 items-center gap-1 whitespace-nowrap text-[11px] text-muted-foreground">
                          <span
                            className={cn(
                              "size-1.5 rounded-full",
                              n.unread ? "bg-primary" : "bg-transparent",
                            )}
                          />
                          {n.timeLabel}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{n.body}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
