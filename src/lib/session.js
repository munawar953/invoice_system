import { cookies } from "next/headers";

export function getSession() {
  const cookieStore = cookies();
  const session = cookieStore.get("session");
  if (!session) return null;

  try {
    return JSON.parse(session.value);
  } catch (e) {
    return null;
  }
}
