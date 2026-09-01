import { NextResponse } from "next/server";
import { generateVerificationCode, sendVerificationEmail, storeVerificationCode } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required to resend a verification code." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const code = generateVerificationCode();
    storeVerificationCode(normalizedEmail, code);

    await sendVerificationEmail({
      email: normalizedEmail,
      code,
    });

    return NextResponse.json({
      success: true,
      message: "Verification code resent successfully.",
    });
  } catch (error) {
    console.error("Resend code error:", error);
    return NextResponse.json(
      { message: "Unable to resend the verification code right now." },
      { status: 500 }
    );
  }
}
