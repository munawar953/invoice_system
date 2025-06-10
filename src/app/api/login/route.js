import { NextResponse } from "next/server";
import prisma from "@/lib/client"; // Your Prisma client
import bcrypt from "bcryptjs";
import { serialize } from "cookie";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Create session token (simple version – can be improved)
    const sessionToken = JSON.stringify({
      userId: user.id,
      email: user.email,
      createdAt: Date.now(),
    });

    const cookie = serialize("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    const res = NextResponse.json({ message: "Login successful" });
    res.headers.set("Set-Cookie", cookie);
    return res;
  } catch (error) {
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}
