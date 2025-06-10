"use client";
import { useEffect, useState } from "react";

// Assumes session is stored in a cookie called "session"
export default function useSession() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSessionFromCookie = () => {
      const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("session="));

      if (!cookie) return null;

      try {
        const decoded = decodeURIComponent(cookie.split("=")[1]);
        return JSON.parse(decoded);
      } catch (e) {
        console.error("Failed to parse session cookie", e);
        return null;
      }
    };

    const sessionData = getSessionFromCookie();
    setSession(sessionData);
  }, []);

  return session;
}
