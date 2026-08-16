import { API_BASE_URL, AUTH_TOKEN_FIELD } from "./config";
import type { AuthResponse, SignInRequest, SignUpRequest } from "./types";

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly responseBody?: unknown
  ) {
    super(message);
    this.name = "AuthError";
  }
}

async function requestAuth(
  endpoint: string,
  body: SignInRequest | SignUpRequest
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  let data: AuthResponse | null = null;

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = (await response.json()) as AuthResponse;
  }

  if (!response.ok) {
    const message =
      typeof data?.message === "string"
        ? data.message
        : typeof data?.error === "string"
          ? data.error
          : `HTTP ${response.status}`;
    throw new AuthError(message, response.status, data);
  }

  if (!data) {
    throw new AuthError("Пустой ответ от сервера");
  }

  const token = data[AUTH_TOKEN_FIELD];
  if (typeof token !== "string" || token.length === 0) {
    throw new AuthError(
      `Ответ не содержит поле ${AUTH_TOKEN_FIELD} с токеном`
    );
  }

  return data;
}

export function signIn(credentials: SignInRequest): Promise<AuthResponse> {
  return requestAuth("/auth/sign-in", credentials);
}

export function signUp(credentials: SignUpRequest): Promise<AuthResponse> {
  return requestAuth("/auth/sign-up", credentials);
}

export function extractToken(response: AuthResponse): string {
  const token = response[AUTH_TOKEN_FIELD];
  if (typeof token !== "string") {
    throw new AuthError(
      `В ответе отсутствует строковое поле ${AUTH_TOKEN_FIELD}`
    );
  }
  return token;
}
