import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const publicRoutes = ["/login"];

export async function middleware(req) {
  const token = await getToken({ req });
  const isAuthenticated = !!token;

  const { pathname } = req.nextUrl;

  if (publicRoutes.includes(pathname)) {
    // Allow access to public routes
    if (isAuthenticated && pathname === "/login") {
      // Redirect logged-in users away from login page
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // If not authenticated, redirect to /login
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Specify paths the middleware should apply to
export const config = {
  //   matcher: ["/((?!_next|api|favicon.ico|images|.*\\..*).*)"],
  matcher: ["/((?!_next|api/auth|favicon.ico|images|.*\\..*).*)"],
};
