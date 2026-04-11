import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { buildGoogleAuthUrl, safeOAuthNextPath } from "@/lib/google-oauth";

export const dynamic = "force-dynamic";

const STATE_COOKIE = "oauth_state";
const NEXT_COOKIE = "oauth_next";
const COOKIE_MAX_AGE = 600;

export async function GET(req: NextRequest) {
  try {
    const next = safeOAuthNextPath(req.nextUrl.searchParams.get("next"));
    const state = randomBytes(24).toString("base64url");
    const url = buildGoogleAuthUrl(state);
    const res = NextResponse.redirect(url);
    const secure = process.env.NODE_ENV === "production";
    res.cookies.set(STATE_COOKIE, state, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });
    res.cookies.set(NEXT_COOKIE, next, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.redirect(
      new URL("/login?error=google_config", req.url)
    );
  }
}
