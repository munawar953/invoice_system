// middleware.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const PUBLIC_PATHS = ["/login", "/api/login", "/api/register"];

export function middleware(req) {
  const session = req.cookies.get("session");

  if (PUBLIC_PATHS.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // If no session, redirect to login
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"],
};
