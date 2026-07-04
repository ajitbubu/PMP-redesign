/**
 * Sends via Resend when RESEND_API_KEY is set; otherwise logs the code to the
 * server console so the flow is fully testable locally without an API key.
 */
export async function sendOtpEmail(email: string, code: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[dev-otp] No RESEND_API_KEY set — verification code for ${email}: ${code}`);
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "ID-PRIVACY <onboarding@resend.dev>",
    to: email,
    subject: "Your ID-PRIVACY verification code",
    text: `Your verification code is ${code}. It expires in 10 minutes.`,
  });
}
