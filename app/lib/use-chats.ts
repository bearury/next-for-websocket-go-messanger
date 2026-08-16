'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { WsClient } from './ws-client'
import type {Chat, ChatMessage, IncomingChatPayload, OutgoingChatPayload, WsConnectionStatus, WsMessage} from './types'

export function useChats(token: string | null) {
    const [chats, setChats] = useState<Chat[]>([])
    const [error, setError] = useState<Event | null>(null)




    return {
        chats,
        error,
    }
}
