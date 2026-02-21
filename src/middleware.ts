import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // tavuel_session is a lightweight cookie set by the frontend on login.
  // Actual auth is enforced by HttpOnly cookies sent to the backend.
  const session = request.cookies.get("tavuel_session")?.value;
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/login";

  if (!session && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|api).*)",
  ],
};
