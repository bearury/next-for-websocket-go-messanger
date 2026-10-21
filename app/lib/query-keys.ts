export const queryKeys = {
    me: ['me'] as const,
    chats: ['chats'] as const,
    users: (search: string) => ['users', search] as const,
    messages: (chatId: string) => ['messages', chatId] as const,
}