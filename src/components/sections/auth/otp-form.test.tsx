import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OtpForm } from "./otp-form";

// OtpForm calls useRouter() at render; stub it so the component mounts in jsdom.
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

afterEach(() => {
  vi.unstubAllGlobals();
});

function getBoxes() {
  const boxes = screen.getAllByRole("textbox") as HTMLInputElement[];
  expect(boxes).toHaveLength(6);
  return boxes as [
    HTMLInputElement,
    HTMLInputElement,
    HTMLInputElement,
    HTMLInputElement,
    HTMLInputElement,
    HTMLInputElement,
  ];
}

describe("OtpForm", () => {
  it("labels each digit box and flags the first for one-time-code autofill", () => {
    render(<OtpForm email="user@example.com" />);
    const boxes = getBoxes();
    boxes.forEach((box, i) => {
      expect(box).toHaveAccessibleName(`Digit ${i + 1} of 6`);
    });
    expect(boxes[0]).toHaveAttribute("autocomplete", "one-time-code");
  });

  it("distributes a pasted 6-digit code across every box (regression: was dropped into box 1)", () => {
    render(<OtpForm email="user@example.com" />);
    const boxes = getBoxes();
    fireEvent.paste(boxes[0], { clipboardData: { getData: () => "123456" } });
    expect(boxes.map((b) => b.value)).toEqual(["1", "2", "3", "4", "5", "6"]);
  });

  it("strips non-digits from a pasted code and fills only the available slots", () => {
    render(<OtpForm email="user@example.com" />);
    const boxes = getBoxes();
    fireEvent.paste(boxes[0], { clipboardData: { getData: () => "12-34" } });
    expect(boxes.map((b) => b.value)).toEqual(["1", "2", "3", "4", "", ""]);
  });

  it("announces a verification failure through an alert region", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ error: "invalid" }), { status: 400 })),
    );
    const user = userEvent.setup();
    render(<OtpForm email="user@example.com" />);
    const boxes = getBoxes();
    fireEvent.paste(boxes[0], { clipboardData: { getData: () => "123456" } });
    await user.click(screen.getByRole("button", { name: /verify/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/that code doesn't match/i);
    // The error is programmatically tied back to the inputs.
    expect(boxes[0]).toHaveAttribute("aria-invalid", "true");
    expect(boxes[0].getAttribute("aria-describedby")).toContain(alert.id);
  });
});
