import { API_BASE_URL } from "./config";
import type {ChatMessage} from "./types";

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

export function fetchMessages(token: string, chatId: string | null): Promise<ChatMessage[]> {
    return authorizedRequest<ChatMessage[]>(token, `/api/chats/${chatId}/messages`);
}
