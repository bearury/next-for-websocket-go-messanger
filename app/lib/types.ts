export type SignInRequest = {
    username: string
    password: string
}

export type SignUpRequest = {
    username: string
    password: string
}

export type AuthResponse = {
    [key: string]: unknown
    token?: string
    accessToken?: string
}

export type WsMessage<TPayload = unknown> = {
    type: string
    payload: TPayload
}

export type OutgoingChatPayload = {
    content: string
    to?: string
}

export type IncomingChatPayload = {
    id?: string
    from?: string
    content?: string
    timestamp?: string
}

export type ChatMessage = {
    id: string
    from: string
    content: string
    timestamp: string
    isOwn: boolean
}

export type Chat = {
    id: string
    name: string
    type: 'user' | 'chain' | 'group'
    isOnline?: boolean
}

export type WsConnectionStatus = 'idle' | 'connecting' | 'open' | 'closing' | 'closed' | 'error'
