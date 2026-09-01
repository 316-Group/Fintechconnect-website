import { NextResponse } from "next/server";
import { generateVerificationCode, sendVerificationEmail, storeVerificationCode } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { fullName, email, password } = await req.json();

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { message: "Full name, email, and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

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

    const code = generateVerificationCode();
    storeVerificationCode(normalizedEmail, code);

    await sendVerificationEmail({
      email: normalizedEmail,
      fullName,
      code,
    });

    return NextResponse.json({
      success: true,
      message: "Verification code sent successfully.",
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Unable to create your account right now. Please try again." },
      { status: 500 }
    );
  }
}
