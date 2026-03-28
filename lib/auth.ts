import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE = "nw_token";
const getSecret = () => {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET não configurado");
  return new TextEncoder().encode(s);
};

export type JwtPayload = {
  sub: string;
  email: string;
  name: string;
};

export async function signToken(payload: JwtPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const sub = payload.sub as string;
    const email = payload.email as string;
    const name = payload.name as string;
    if (!sub || !email) return null;
    return { sub, email, name: name ?? "" };
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookie() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function getSession(): Promise<JwtPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}
