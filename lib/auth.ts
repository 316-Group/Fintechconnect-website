import {
  createHash,
  randomBytes,
  scrypt as nodeScrypt,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(nodeScrypt);
const PASSWORD_KEY_LENGTH = 64;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, PASSWORD_KEY_LENGTH)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [salt, key] = storedHash.split(":");
  if (!salt || !key) return false;

  const derivedKey = (await scrypt(password, salt, PASSWORD_KEY_LENGTH)) as Buffer;
  const storedKey = Buffer.from(key, "hex");
  return storedKey.length === derivedKey.length && timingSafeEqual(derivedKey, storedKey);
}

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createSessionToken() {
  return randomBytes(32).toString("hex");
}

import { cookies } from "next/headers";
import { db } from "@/lib/db";

export function hashVerificationCode(code: string) {
  return createHash("sha256").update(code).digest("hex");
}

export async function getCurrentUser(options?: { token?: string; email?: string }) {
  let token = options?.token;
  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get("auth_token")?.value;
    } catch {
      // Cookies might not be accessible outside of request scope
    }
  }

  if (token) {
    const tokenHash = hashSessionToken(token);
    const session = await db.session.findUnique({
      where: { tokenHash },
      include: {
        user: {
          include: {
            onboardingProfile: true,
          },
        },
      },
    });

    if (session && session.expiresAt > new Date()) {
      return session.user;
    }
  }

  if (options?.email) {
    const normalized = normalizeEmail(options.email);
    const user = await db.user.findUnique({
      where: { email: normalized },
      include: {
        onboardingProfile: true,
      },
    });
    return user;
  }

  return null;
}