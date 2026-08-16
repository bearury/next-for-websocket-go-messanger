'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { WsClient } from './ws-client'
import type { ChatMessage, IncomingChatPayload, OutgoingChatPayload, WsConnectionStatus, WsMessage } from './types'

export function useMessenger(token: string | null) {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [status, setStatus] = useState<WsConnectionStatus>('idle')
    const [error, setError] = useState<Event | null>(null)
    const clientRef = useRef<WsClient | null>(null)

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

            if (message.type === 'message') {
                const payload = message.payload as IncomingChatPayload
                const chatMessage: ChatMessage = {
                    id: payload.id ?? crypto.randomUUID(),
                    from: payload.from ?? 'unknown',
                    content: payload.content ?? '',
                    timestamp: payload.timestamp ?? new Date().toISOString(),
                    isOwn: false,
                }
                setMessages((prev) => [...prev, chatMessage])
            }
        })

        client.connect()

        return () => {
            unsubscribeStatus()
            unsubscribeMessage()
            client.dispose()
            clientRef.current = null
        }
    }, [token])

    const sendMessage = useCallback((content: string, to?: string) => {
        const client = clientRef.current
        if (!client) return false

        const payload: OutgoingChatPayload = { content, to }
        const sent = client.send('message', payload)

        if (sent) {
            const ownMessage: ChatMessage = {
                id: crypto.randomUUID(),
                from: 'me',
                content,
                timestamp: new Date().toISOString(),
                isOwn: true,
            }
            setMessages((prev) => [...prev, ownMessage])
        }

        return sent
    }, [])

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
