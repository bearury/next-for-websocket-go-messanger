"use client";

import { AuthForm } from "@/app/components/auth-form";
import { useAuth } from "@/app/lib/use-auth";

export default function SignUpPage() {
  const { register, isLoading, error, clearError } = useAuth();

  return (
    <AuthForm
      mode="sign-up"
      onSubmit={(credentials) => {
        clearError();
        void register(credentials);
      }}
      isLoading={isLoading}
      error={error}
    />
  );
}
