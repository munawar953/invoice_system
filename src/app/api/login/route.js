import { NextResponse } from "next/server";
import prisma from "@/lib/client";
import bcrypt from "bcryptjs";
import { serialize } from "cookie";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Create session payload
    const sessionPayload = JSON.stringify({
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: Date.now(),
    });

    const cookie = serialize("session", sessionPayload, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    const res = NextResponse.json({ message: "Login successful" });
    res.headers.append("Set-Cookie", cookie); // ✅ Append is important

    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
