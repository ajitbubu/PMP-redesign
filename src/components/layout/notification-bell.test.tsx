import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NotificationBell } from "./notification-bell";
import { notifications } from "@/lib/data/dashboard";

describe("NotificationBell", () => {
  it("labels the trigger, reflecting the unread state", () => {
    render(<NotificationBell />);
    const hasUnread = notifications.some((n) => n.unread);
    const name = hasUnread ? "Notifications, unread" : "Notifications";
    expect(screen.getByRole("button", { name })).toBeInTheDocument();
  });

  it("opens the panel with the unread-only toggle checked by default", async () => {
    const user = userEvent.setup();
    render(<NotificationBell />);
    await user.click(screen.getByRole("button", { name: /Notifications/ }));

    expect(await screen.findByText("Notification")).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "Only show unread notifications" })).toBeChecked();
  });
});
