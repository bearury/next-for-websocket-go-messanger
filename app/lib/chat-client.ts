import { API_BASE_URL } from "./config";
import type { Chat, CreateChatRequest, User } from "./types";

export class ApiError extends Error {
    constructor(
        message: string,
        public readonly status?: number,
    ) {
        super(message);
        this.name = "ApiError";
    }
}

async function authorizedRequest<T>(
    token: string,
    endpoint: string,
    init?: RequestInit,
): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            ...init?.headers,
        },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const message =
            typeof data?.message === "string"
                ? data.message
                : typeof data?.error === "string"
                    ? data.error
                    : `HTTP ${response.status}`;
        throw new ApiError(message, response.status);
    }

    return data as T;
}

export function fetchMe(token: string): Promise<User> {
    return authorizedRequest<User>(token, "/api/me");
}

export function fetchChats(token: string): Promise<Chat[]> {
    return authorizedRequest<Chat[]>(token, "/api/chats");
}

export function searchUsers(token: string, search: string): Promise<User[]> {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    return authorizedRequest<User[]>(token, `/api/users?${params.toString()}`);
}

export function createChat(
    token: string,
    body: CreateChatRequest,
): Promise<Chat> {
    return authorizedRequest<Chat>(token, "/api/chats", {
        method: "POST",
        body: JSON.stringify(body),
    });
}
