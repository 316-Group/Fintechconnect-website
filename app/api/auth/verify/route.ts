import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashVerificationCode, normalizeEmail } from "@/lib/auth";

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
    const user = await db.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      return NextResponse.json(
        { message: "No account found for this email address." },
        { status: 404 }
      );
    }

    if (user.emailVerifiedAt) {
      return NextResponse.json({
        success: true,
        message: "Email is already verified.",
      });
    }

    if (
      !user.verificationCodeHash ||
      !user.verificationCodeExpiresAt ||
      user.verificationCodeExpiresAt < new Date()
    ) {
      return NextResponse.json(
        { message: "Verification code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    if (user.verificationCodeHash !== hashVerificationCode(String(code).trim())) {
      return NextResponse.json(
        { message: "Invalid verification code." },
        { status: 401 }
      );
    }

    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerifiedAt: new Date(),
        verificationCodeHash: null,
        verificationCodeExpiresAt: null,
      },
    });

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
