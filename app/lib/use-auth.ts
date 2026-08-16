"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { extractToken, signIn, signUp, AuthError } from "./auth-client";
import {
  getToken,
  removeToken,
  saveToken,
  subscribeToken,
} from "./auth-store";
import type { SignInRequest, SignUpRequest } from "./types";

export function useAuth() {
  const router = useRouter();
  const token = useSyncExternalStore(
    subscribeToken,
    getToken,
    () => null // server snapshot
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = useCallback(
    async (
      action: () => ReturnType<typeof signIn>,
      successRedirect: string
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await action();
        const newToken = extractToken(response);
        saveToken(newToken);
        router.push(successRedirect);
      } catch (err) {
        if (err instanceof AuthError) {
          setError(err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Произошла неизвестная ошибка");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const login = useCallback(
    (credentials: SignInRequest) => {
      return handleAuth(() => signIn(credentials), "/messenger");
    },
    [handleAuth]
  );

  const register = useCallback(
    (credentials: SignUpRequest) => {
      return handleAuth(() => signUp(credentials), "/messenger");
    },
    [handleAuth]
  );

  const logout = useCallback(() => {
    removeToken();
    router.push("/sign-in");
  }, [router]);

  return {
    isAuthenticated: token !== null,
    token,
    login,
    register,
    logout,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
