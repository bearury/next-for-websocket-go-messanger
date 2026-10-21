'use client'

import { useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { queryKeys } from './query-keys'
import type {
	ChatMessage,
	IncomingChatPayload,
	PayloadWsMessage, User,
	WsConnectionStatus,
	WsMessage,
} from './types'
import { useToken } from './use-token'
import { WsClient } from './ws-client'
import {fetchMessages} from "@/app/lib/messages-client";
import {useChatsQuery} from "@/app/lib/use-chats";

function appendMessage(
    queryClient: QueryClient,
    chatId: string,
    message: ChatMessage,
): void {
    queryClient.setQueryData<ChatMessage[]>(queryKeys.messages(chatId), (prev) => [
        ...(prev ?? []),
        message,
    ])
}

/**
 * Сообщения живут в кеше TanStack Query по ключу чата.
 * У бэкенда нет ручки истории, поэтому queryFn отдаёт пустой список,
 * а данные приходят из WebSocket.
 */
export function useMessagesQuery(chatId: string | null) {
		const token = useToken()


		return useQuery({
			queryKey: queryKeys.messages(chatId ?? 'none'),
			queryFn: () => {
				if (!token) throw new Error('Требуется авторизация')
				return fetchMessages(token, chatId)
			},
			enabled: chatId !== null,
			staleTime: Infinity,
			gcTime: 60 * 60 * 1000,
		})

}

export function useMessages(activeChatId: string | null) {
    const token = useToken()
    const queryClient = useQueryClient()
		const { data: chats, refetch } = useChatsQuery()
    const [status, setStatus] = useState<WsConnectionStatus>('idle')
    const [error, setError] = useState<Event | null>(null)
    const clientRef = useRef<WsClient | null>(null)
    const activeChatIdRef = useRef(activeChatId)

    useEffect(() => {
        activeChatIdRef.current = activeChatId
    }, [activeChatId])

    useEffect(() => {
        if (!token) return

        const client = new WsClient(token)
        clientRef.current = client

        const unsubscribeStatus = client.onStatusChange((newStatus, err) => {
            setStatus(newStatus)
            if (err) setError(err)
        })

        const unsubscribeMessage = client.onMessage((message: WsMessage) => {
            console.log('🍄:', message)

            if (message.type !== 'message') return

						if (!chats?.findIndex((c) => c.id === message.payload?.to.id) ) {
							refetch()
						}



            // Бэкенд не присылает chat_id в broadcast, поэтому входящее
            // сообщение относим к чату, открытому в момент получения.
            const chatId = activeChatIdRef.current
            if (!chatId) return

            const payload = message.payload as IncomingChatPayload
            appendMessage(queryClient, chatId, {
                id: payload.id ?? crypto.randomUUID(),
                userId: payload.from ?? 'unknown',
								userName: payload.from ?? 'unknown',
								chatId,
                content: payload.content ?? '',
                createdAt: payload.timestamp ?? new Date().toISOString(),
            })
        })



        client.connect()

        return () => {
            unsubscribeStatus()
            unsubscribeMessage()
            client.dispose()
            clientRef.current = null
        }
    }, [token, queryClient])

    const { data: messages = [] } = useMessagesQuery(activeChatId)

    const sendMessage = useCallback(
        (user: User, content: string) => {
            const client = clientRef.current
            const chatId = activeChatIdRef.current
            if (!client || !chatId) return false

            const payload: PayloadWsMessage = { content, from: user.username,  to: { id: chatId, type: 'chat' } }
            const sent = client.send('message', payload)

						console.log('[114] 🍓: ', payload)


            if (sent) {
                appendMessage(queryClient, chatId, {
                    id: crypto.randomUUID(),
                    userId: user.id,
										userName: user.name ?? '',
										chatId,
                    content,
                    createdAt: new Date().toISOString(),
                })
            }

            return sent
        },
        [queryClient],
    )


    const reconnect = useCallback(() => {
        clientRef.current?.connect()
    }, [])

    return {
        messages,
        status,
        error,
        sendMessage,
        reconnect,
    }
}
