import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, hashVerificationCode, normalizeEmail } from "@/lib/auth";
import { generateVerificationCode, sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { fullName, email, password } = await req.json();

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { message: "Full name, email, and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = normalizeEmail(String(email));

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json(
        { message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (String(password).length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
      select: { emailVerifiedAt: true },
    });

    if (existingUser?.emailVerifiedAt) {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const code = generateVerificationCode();
    const passwordHash = await hashPassword(String(password));

    await db.user.upsert({
      where: { email: normalizedEmail },
      create: {
        fullName: String(fullName).trim(),
        email: normalizedEmail,
        passwordHash,
        verificationCodeHash: hashVerificationCode(code),
        verificationCodeExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
      update: {
        fullName: String(fullName).trim(),
        passwordHash,
        verificationCodeHash: hashVerificationCode(code),
        verificationCodeExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    await sendVerificationEmail({
      email: normalizedEmail,
      fullName: String(fullName).trim(),
      code,
    });

    return NextResponse.json({
      success: true,
      message: "Verification code sent successfully.",
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof Error && error.message.startsWith("Email delivery is not configured")) {
      return NextResponse.json({ message: error.message }, { status: 503 });
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to create your account right now. Please try again." },
      { status: 500 }
    );
  }
}
