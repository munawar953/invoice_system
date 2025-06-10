import { serialize } from "cookie";
import { NextResponse } from "next/server";

export async function POST() {
  const cookie = serialize("session", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0), // Expire immediately
  });

  const res = NextResponse.json({ message: "Logged out" });
  res.headers.set("Set-Cookie", cookie);
  return res;
}
