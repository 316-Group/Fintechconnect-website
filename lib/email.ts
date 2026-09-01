import { Resend } from "resend";

export type VerificationEntry = {
  code: string;
  createdAt: number;
};

const verificationCodes = new Map<string, VerificationEntry>();

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000)
    .toString()
    .padStart(6, "0");
}

export function storeVerificationCode(email: string, code?: string) {
  const normalizedEmail = normalizeEmail(email);
  const verificationCode = code ?? generateVerificationCode();

  verificationCodes.set(normalizedEmail, {
    code: verificationCode,
    createdAt: Date.now(),
  });

  return verificationCode;
}

export function getVerificationCode(email: string) {
  return verificationCodes.get(normalizeEmail(email));
}

export function deleteVerificationCode(email: string) {
  verificationCodes.delete(normalizeEmail(email));
}

export async function sendVerificationEmail({
  email,
  fullName,
  code,
}: {
  email: string;
  fullName?: string;
  code: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "Fintech Connect <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn(
      "RESEND_API_KEY is not configured. Verification email was not sent. Use the generated code for local testing only."
    );
    return { sent: false, code };
  }

  const resend = new Resend(apiKey);

  await resend.emails.send({
    from,
    to: email,
    subject: "Verify your email address",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a; max-width: 560px; margin: 0 auto;">
        <h2 style="margin-bottom: 16px;">Verify your email</h2>
        <p>Hello${fullName ? ` ${fullName}` : ""},</p>
        <p>Thanks for signing up with Fintech Connect. Use the code below to verify your email address:</p>
        <div style="margin: 24px 0; padding: 20px 24px; background: #eff6ff; border-radius: 12px; text-align: center; border: 1px solid #dbeafe;">
          <div style="font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: #475569; margin-bottom: 8px;">Verification code</div>
          <div style="font-size: 36px; font-weight: 700; letter-spacing: 0.25em; color: #0f172a;">${code}</div>
        </div>
        <p>If you did not create this account, you can safely ignore this email.</p>
        <p style="margin-top: 20px;">Best,<br />Fintech Connect</p>
      </div>
    `,
  });

  return { sent: true, code };
}
