import { NotificationBell } from "@/components/layout/notification-bell";
import { UserMenu } from "@/components/layout/user-menu";
import { currentUser } from "@/lib/data/nav";

/**
 * Sticky top bar for the authenticated shell. On mobile it stacks the greeting
 * over the portal name (matches the Figma mobile header); on desktop it shows
 * the greeting inline with the notification bell + user menu.
 */
export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:py-4">
        <div className="min-w-0">
          <p className="truncate text-sm text-muted-foreground sm:text-base sm:text-foreground sm:font-semibold">
            Welcome Back, {currentUser.firstName}!
          </p>
          <p className="truncate font-display text-lg font-bold text-foreground sm:hidden">
            Privacy Management Portal
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <NotificationBell />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
