"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, subscribeToken } from "@/app/lib/auth-store";
import { useSyncExternalStore } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useSyncExternalStore(
    subscribeToken,
    getToken,
    () => null // server snapshot
  );

  useEffect(() => {
    if (token === null) {
      router.replace("/sign-in");
    }
  }, [token, router]);

  if (token === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
