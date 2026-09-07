import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashVerificationCode, normalizeEmail } from "@/lib/auth";
import { generateVerificationCode, sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required to resend a verification code." },
        { status: 400 }
      );
    }

    const normalizedEmail = normalizeEmail(String(email));
    const user = await db.user.findUnique({ where: { email: normalizedEmail } });

    if (!user || user.emailVerifiedAt) {
      return NextResponse.json(
        { message: "Unable to resend the verification code." },
        { status: 404 }
      );
    }

    const code = generateVerificationCode();

    await db.user.update({
      where: { id: user.id },
      data: {
        verificationCodeHash: hashVerificationCode(code),
        verificationCodeExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    await sendVerificationEmail({
      email: normalizedEmail,
      fullName: user.fullName,
      code,
    });

    return NextResponse.json({
      success: true,
      message: "Verification code resent successfully.",
    });
  } catch (error) {
    console.error("Resend code error:", error);
    if (error instanceof Error && error.message.startsWith("Email delivery is not configured")) {
      return NextResponse.json({ message: error.message }, { status: 503 });
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to resend the verification code right now." },
      { status: 500 }
    );
  }
}
