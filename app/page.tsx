"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "./lib/auth-store";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (token) {
      router.replace("/messenger");
    } else {
      router.replace("/sign-in");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-foreground" />
    </div>
  );
}
