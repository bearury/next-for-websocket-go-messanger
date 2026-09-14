"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/app/lib/auth-store";
import { fetchMe } from "@/app/lib/chat-client";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Читаем токен напрямую из localStorage, минуя серверный снапшот,
    // иначе при гидратации видим null и редиректим до чтения токена.
    const token = getToken();
    if (!token) {
      router.replace("/sign-in");
      return;
    }

    let cancelled = false;

    fetchMe(token)
      .then(() => {
        if (!cancelled) setIsChecking(false);
      })
      .catch(() => {
        if (cancelled) return;
        router.replace("/sign-in");
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
