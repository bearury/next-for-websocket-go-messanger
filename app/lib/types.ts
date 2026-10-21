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

// export type WsMessage<TPayload = unknown> = {
//     type: string
//     payload: TPayload
// }

export interface PayloadWsMessage {
	content: string,
	from: string,
	to: {
		id: string
		type: string
	}
}

export type WsMessage = {
	type: string
	payload: PayloadWsMessage
}

export type OutgoingChatPayload = {
    content: string
    to?: string
    chat_id?: string
}

export type User = {
    id: string
    username: string
    name?: string
}

export type CreateChatRequest = {
    name: string
    type: 'chat'
    userIds: string[]
}

export type IncomingChatPayload = {
    id?: string
    from?: string
    content?: string
    timestamp?: string
}

export type ChatMessage = {
		id: string
		userId: string
		userName: string
		chatId: string
		content: string
		createdAt: string
}

export type Chat = {
    id: string
    name: string
    type: 'chat' | 'chain' | 'group'
    isOnline?: boolean
}

export type WsConnectionStatus = 'idle' | 'connecting' | 'open' | 'closing' | 'closed' | 'error'
