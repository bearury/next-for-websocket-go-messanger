export const API_BASE_URL = "http://localhost:8080";
export const WS_BASE_URL = "ws://localhost:8080/ws";
export const AUTH_TOKEN_KEY = "auth_token";

/**
 * Поле ответа авторизации, в котором лежит JWT.
 * Если бэкенд возвращает другое имя (например, accessToken),
 * поменяйте здесь.
 */
export const AUTH_TOKEN_FIELD = "token" as const;
