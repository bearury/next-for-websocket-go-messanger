"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { removeToken, getToken } from "@/app/lib/auth-store";
import { ApiError } from "@/app/lib/chat-client";
import { useMeQuery } from "@/app/lib/use-me";
import { useToken } from "@/app/lib/use-token";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useToken();
  const { error, isPending, isError } = useMeQuery();

  useEffect(() => {
    // Проверяем именно localStorage: при гидратации useSyncExternalStore
    // отдаёт серверный снапшот null, и редирект по нему разлогинивал
    // пользователя при каждой перезагрузке страницы.
    if (!getToken()) {
      router.replace("/sign-in");
    }
  }, [router]);

  useEffect(() => {
    if (!isError) return;

    if (error instanceof ApiError && error.status === 401) {
      removeToken();
    }
    router.replace("/sign-in");
  }, [isError, error, router]);

  if (!token || isPending || isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
