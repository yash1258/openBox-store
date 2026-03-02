import bcrypt from 'bcrypt';
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "seller_session";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(sellerId: string): Promise<string> {
  const sessionToken = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  await prisma.seller.update({
    where: { id: sellerId },
    data: { updatedAt: new Date() },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, JSON.stringify({
    token: sessionToken,
    sellerId,
    expiresAt: expiresAt.toISOString(),
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return sessionToken;
}

export async function getSession(): Promise<{ sellerId: string; email: string; name: string; shopName: string } | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);

  if (!sessionCookie) {
    return null;
  }

  try {
    const session = JSON.parse(sessionCookie.value);

    if (new Date(session.expiresAt) < new Date()) {
      await destroySession();
      return null;
    }

    const seller = await prisma.seller.findUnique({
      where: { id: session.sellerId },
      select: {
        id: true,
        email: true,
        name: true,
        shopName: true,
        isActive: true,
      },
    });

    if (!seller || !seller.isActive) {
      await destroySession();
      return null;
    }

    return {
      sellerId: seller.id,
      email: seller.email,
      name: seller.name,
      shopName: seller.shopName,
    };
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function requireSeller(): Promise<{ sellerId: string; email: string; name: string; shopName: string }> {
  const session = await getSession();

  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  return session;
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}
