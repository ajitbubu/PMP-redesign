import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendOtpEmail } from "./mailer";

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

describe("sendOtpEmail", () => {
  const prevKey = process.env.RESEND_API_KEY;
  const prevFrom = process.env.EMAIL_FROM;

  beforeEach(() => {
    sendMock.mockReset();
    sendMock.mockResolvedValue({ id: "mock" });
  });

  afterEach(() => {
    if (prevKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = prevKey;
    if (prevFrom === undefined) delete process.env.EMAIL_FROM;
    else process.env.EMAIL_FROM = prevFrom;
    vi.restoreAllMocks();
  });

  it("logs the code to the console and skips Resend when no API key is set", async () => {
    delete process.env.RESEND_API_KEY;
    const log = vi.spyOn(console, "log").mockImplementation(() => {});

    await sendOtpEmail("user@example.com", "123456");

    expect(sendMock).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith(expect.stringContaining("123456"));
    expect(log).toHaveBeenCalledWith(expect.stringContaining("user@example.com"));
  });

  it("sends via Resend when the API key is set", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.EMAIL_FROM = "ID-PRIVACY <noreply@example.com>";

    await sendOtpEmail("user@example.com", "654321");

    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "ID-PRIVACY <noreply@example.com>",
        to: "user@example.com",
        text: expect.stringContaining("654321"),
      }),
    );
  });
});
