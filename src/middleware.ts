import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isTokenExpired(token: string): boolean {
  try {
    const payload = token.split(".")[1];
    if (!payload) return true;
    const decoded = JSON.parse(atob(payload));
    if (!decoded.exp) return true;
    // Expired if less than 30 seconds remaining
    return decoded.exp * 1000 < Date.now() + 30_000;
  } catch {
    return true;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("tavuel_access")?.value;
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/login";

  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isTokenExpired(token)) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("tavuel_access");
    return response;
  }

  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|api).*)",
  ],
};
