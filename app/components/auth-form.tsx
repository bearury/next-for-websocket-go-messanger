"use client";

import { useState } from "react";
import Link from "next/link";

export type AuthMode = "sign-in" | "sign-up";

export type AuthFormProps = {
  mode: AuthMode;
  onSubmit: (credentials: { username: string; password: string }) => void;
  isLoading: boolean;
  error: string | null;
};

export function AuthForm({ mode, onSubmit, isLoading, error }: AuthFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const isSignIn = mode === "sign-in";
  const title = isSignIn ? "Вход" : "Регистрация";
  const submitText = isSignIn ? "Войти" : "Зарегистрироваться";
  const altText = isSignIn ? "Нет аккаунта?" : "Уже есть аккаунт?";
  const altLink = isSignIn ? "/sign-up" : "/sign-in";
  const altLinkText = isSignIn ? "Зарегистрироваться" : "Войти";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!username.trim() || !password.trim() || isLoading) return;
    onSubmit({ username: username.trim(), password });
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h1 className="mb-6 text-center text-2xl font-semibold">{title}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="username" className="text-sm font-medium">
            Имя пользователя
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="username"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            Пароль
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isSignIn ? "current-password" : "new-password"}
            required
            minLength={4}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-zinc-200"
        >
          {isLoading ? "Загрузка..." : submitText}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
        {altText}{" "}
        <Link
          href={altLink}
          className="font-medium text-foreground underline underline-offset-2"
        >
          {altLinkText}
        </Link>
      </p>
    </div>
  );
}
