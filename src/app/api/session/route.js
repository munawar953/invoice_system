// src/app/api/session/route.js
import { cookies } from "next/headers";

export async function GET() {
  const sessionCookie = cookies().get("session");

  if (!sessionCookie) {
    return Response.json({ session: null }, { status: 200 });
  }

  const session = JSON.parse(sessionCookie.value);

  return Response.json({ session }, { status: 200 });
}
