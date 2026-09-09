import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  createSessionToken,
  hashSessionToken,
  hashVerificationCode,
  normalizeEmail,
} from "@/lib/auth";

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

    const maxAge = 60 * 60 * 24 * 30; // 30 days
    const sessionToken = createSessionToken();

    await db.session.create({
      data: {
        tokenHash: hashSessionToken(sessionToken),
        userId: user.id,
        expiresAt: new Date(Date.now() + maxAge * 1000),
      },
    });

    const response = NextResponse.json({
      message: "Email verified successfully.",
      success: true,
    });

    response.cookies.set("auth_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });

    return response;
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { message: "Unable to verify your email right now." },
      { status: 500 }
    );
  }
}