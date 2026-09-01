import { NextResponse } from "next/server";
import { deleteVerificationCode, getVerificationCode, normalizeEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { message: "Email and verification code are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = normalizeEmail(String(email));
    const storedCode = getVerificationCode(normalizedEmail)?.code;

    if (!storedCode || storedCode !== String(code).trim()) {
      return NextResponse.json(
        { message: "Invalid verification code." },
        { status: 401 }
      );
    }

    deleteVerificationCode(normalizedEmail);

    return NextResponse.json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { message: "Unable to verify your email right now." },
      { status: 500 }
    );
  }
}
