"use client";
import { useEffect, useState } from "react";

export default function useSession() {
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    fetch("/api/session")
      .then(res => res.json())
      .then(data => {
        setSession(data.session);
        setStatus(data.session ? "authenticated" : "unauthenticated");
      })
      .catch(err => {
        console.error("Failed to load session", err);
        setStatus("unauthenticated");
      });
  }, []);

  return { data: session, status };
}
