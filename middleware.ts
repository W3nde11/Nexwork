import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPrefixes = ["/dashboard", "/feed", "/chat", "/conta"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("nw_token")?.value;
  const path = req.nextUrl.pathname;

  /** Confirmação de exclusão por token — acessível sem login (link no e-mail). */
  if (path.startsWith("/conta/excluir")) {
    return NextResponse.next();
  }

  if (protectedPrefixes.some((p) => path === p || path.startsWith(`${p}/`))) {
    if (!token) {
      const login = new URL("/login", req.url);
      login.searchParams.set("next", path);
      return NextResponse.redirect(login);
    }
  }

  if (token && (path === "/login" || path === "/cadastro" || path === "/recuperar-senha")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/feed/:path*",
    "/chat/:path*",
    "/conta",
    "/conta/:path*",
    "/login",
    "/cadastro",
    "/recuperar-senha",
  ],
};
