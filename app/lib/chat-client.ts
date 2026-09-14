import { API_BASE_URL } from "./config";
import type { CreateChatRequest, CreateChatResponse, User } from "./types";

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
        throw new Error(message);
    }

    return data as T;
}

export function fetchMe(token: string): Promise<User> {
    return authorizedRequest<User>(token, "/api/me");
}

export function searchUsers(token: string, search: string): Promise<User[]> {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    return authorizedRequest<User[]>(token, `/api/users?${params.toString()}`);
}

export function createChat(
    token: string,
    body: CreateChatRequest,
): Promise<CreateChatResponse> {
    return authorizedRequest<CreateChatResponse>(token, "/api/chat", {
        method: "POST",
        body: JSON.stringify(body),
    });
}
