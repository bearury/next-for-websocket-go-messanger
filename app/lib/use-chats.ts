'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createChat, fetchChats } from './chat-client'
import { queryKeys } from './query-keys'
import { useToken } from './use-token'
import type { Chat, CreateChatRequest } from './types'

function upsertChat(chats: Chat[] | undefined, chat: Chat): Chat[] {
    const rest = chats?.filter((item) => item.id !== chat.id) ?? []
    return [chat, ...rest]
}

export function useChatsQuery() {
    const token = useToken()

    return useQuery({
        queryKey: queryKeys.chats,
        queryFn: () => {
            if (!token) throw new Error('Требуется авторизация')
            return fetchChats(token)
        },
        enabled: token !== null,
    })
}

export function useCreateChatMutation() {
    const token = useToken()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (body: CreateChatRequest) => {
            if (!token) throw new Error('Требуется авторизация')
            return createChat(token, body)
        },
        // Бэкенд отдаёт только чаты, в которых уже есть сообщения,
        // поэтому новый чат кладём в кеш сами, без инвалидации.
        onSuccess: (chat) => {
            queryClient.setQueryData<Chat[]>(queryKeys.chats, (chats) => upsertChat(chats, chat))
        },
    })
}
