"use client";

import { AuthForm } from "@/app/components/auth-form";
import { useAuth } from "@/app/lib/use-auth";

export default function SignInPage() {
  const { login, isLoading, error, clearError } = useAuth();

  return (
    <AuthForm
      mode="sign-in"
      onSubmit={(credentials) => {
        clearError();
        void login(credentials);
      }}
      isLoading={isLoading}
      error={error}
    />
  );
}
