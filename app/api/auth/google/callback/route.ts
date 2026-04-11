import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { applyAuthCookie, signToken } from "@/lib/auth";
import {
  exchangeGoogleCode,
  fetchGoogleProfile,
  safeOAuthNextPath,
} from "@/lib/google-oauth";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

const STATE_COOKIE = "oauth_state";
const NEXT_COOKIE = "oauth_next";

function loginRedirect(req: NextRequest, error: string) {
  const u = new URL("/login", req.url);
  u.searchParams.set("error", error);
  const res = NextResponse.redirect(u);
  res.cookies.delete(STATE_COOKIE);
  res.cookies.delete(NEXT_COOKIE);
  return res;
}

export async function GET(req: NextRequest) {
  const err = req.nextUrl.searchParams.get("error");
  if (err) {
    return loginRedirect(req, err === "access_denied" ? "google_denied" : "google_oauth");
  }

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const cookieState = req.cookies.get(STATE_COOKIE)?.value;
  const nextRaw = req.cookies.get(NEXT_COOKIE)?.value ?? "/dashboard";
  const nextPath = safeOAuthNextPath(nextRaw);

  if (!code || !state || !cookieState || state !== cookieState) {
    return loginRedirect(req, "oauth_state");
  }

  try {
    const { access_token } = await exchangeGoogleCode(code);
    const profile = await fetchGoogleProfile(access_token);

    if (!profile.email_verified) {
      return loginRedirect(req, "email_unverified");
    }

    const email = profile.email.toLowerCase().trim();

    await connectDB();

    let user = await User.findOne({ googleId: profile.sub });
    if (!user) {
      const byEmail = await User.findOne({ email });
      if (byEmail) {
        if (byEmail.googleId && byEmail.googleId !== profile.sub) {
          return loginRedirect(req, "google_account_mismatch");
        }
        byEmail.googleId = profile.sub;
        if (profile.name && !byEmail.name) {
          byEmail.name = profile.name;
        }
        await byEmail.save();
        user = byEmail;
      } else {
        user = await User.create({
          email,
          name: profile.name?.trim() || email.split("@")[0] || "Usuário",
          googleId: profile.sub,
          passwordHash: null,
        });
      }
    }

    const token = await signToken({
      sub: user!._id.toString(),
      email: user!.email,
      name: user!.name,
    });

    const dest = new URL(nextPath, req.nextUrl.origin);
    const res = NextResponse.redirect(dest);
    applyAuthCookie(res, token);
    res.cookies.delete(STATE_COOKIE);
    res.cookies.delete(NEXT_COOKIE);
    return res;
  } catch (e) {
    console.error(e);
    return loginRedirect(req, "oauth_failed");
  }
}
