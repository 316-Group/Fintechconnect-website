import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  createSessionToken,
  hashSessionToken,
  normalizeEmail,
  verifyPassword,
} from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password, rememberMe } = await request.json();
    const normalizedEmail = normalizeEmail(String(email ?? ''));

    if (!normalizedEmail || !password) {
      return NextResponse.json(
        { message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({ where: { email: normalizedEmail } });

    if (!user || !(await verifyPassword(String(password ?? ''), user.passwordHash))) {
      return NextResponse.json(
        { message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    if (!user.emailVerifiedAt) {
      return NextResponse.json(
        {
          message: 'Please verify your email address before signing in.',
          unverified: true,
          email: normalizedEmail,
        },
        { status: 403 }
      );
    }

    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24;
    const sessionToken = createSessionToken();
    await db.session.create({
      data: {
        tokenHash: hashSessionToken(sessionToken),
        userId: user.id,
        expiresAt: new Date(Date.now() + maxAge * 1000),
      },
    });

    const response = NextResponse.json({
      message: 'Authentication successful',
      success: true,
    });

    response.cookies.set('auth_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}