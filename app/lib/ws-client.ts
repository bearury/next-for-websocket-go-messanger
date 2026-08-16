import { WS_BASE_URL } from './config'
import type { WsConnectionStatus, WsMessage } from './types'

type MessageHandler = (message: WsMessage) => void
type StatusHandler = (status: WsConnectionStatus, error?: Event) => void

export class WsClient {
    private socket: WebSocket | null = null
    private reconnectTimer: ReturnType<typeof setTimeout> | null = null
    private heartbeatTimer: ReturnType<typeof setInterval> | null = null
    private readonly messageHandlers = new Set<MessageHandler>()
    private readonly statusHandlers = new Set<StatusHandler>()
    private readonly token: string
    private reconnectAttempts = 0
    private isDisposed = false

    private readonly heartbeatIntervalMs: number
    private readonly reconnectBaseDelayMs: number
    private readonly maxReconnectDelayMs: number

    constructor(
        token: string,
        options?: {
            heartbeatIntervalMs?: number
            reconnectBaseDelayMs?: number
            maxReconnectDelayMs?: number
        },
    ) {
        this.token = token
        this.heartbeatIntervalMs = options?.heartbeatIntervalMs ?? 30000
        this.reconnectBaseDelayMs = options?.reconnectBaseDelayMs ?? 1000
        this.maxReconnectDelayMs = options?.maxReconnectDelayMs ?? 10000
    }

    connect(): void {
        if (this.isDisposed || typeof window === 'undefined') return

        if (this.socket) {
            return
        }

        this.setStatus('connecting')

        const url = new URL(WS_BASE_URL)
        url.searchParams.set('token', this.token)

        try {
            this.socket = new WebSocket(url.toString())
        } catch (error) {
            this.setStatus('error', error instanceof Event ? error : undefined)
            this.scheduleReconnect()
            return
        }

        this.socket.onopen = () => {
            this.reconnectAttempts = 0
            this.setStatus('open')
            this.startHeartbeat()
        }

        this.socket.onmessage = (event) => {
            this.handleMessage(event.data)
        }

        this.socket.onerror = (event) => {
            this.setStatus('error', event)
        }

        this.socket.onclose = () => {
            this.socket = null
            this.stopHeartbeat()
            this.setStatus('closed')
            this.scheduleReconnect()
        }
    }

    disconnect(): void {
        this.clearReconnectTimer()
        this.stopHeartbeat()

        if (this.socket) {
            this.setStatus('closing')
            try {
                this.socket.close()
            } catch {
                // ignore
            }
            this.socket = null
        }
    }

    dispose(): void {
        this.isDisposed = true
        this.disconnect()
        this.messageHandlers.clear()
        this.statusHandlers.clear()
    }

    send<TPayload>(type: string, payload: TPayload): boolean {
        if (this.socket?.readyState !== WebSocket.OPEN) {
            return false
        }

        const message: WsMessage<TPayload> = { type, payload }

        console.log('🚀:', message)

        try {
            this.socket.send(JSON.stringify(message))
            return true
        } catch {
            return false
        }
    }

    onMessage(handler: MessageHandler): () => void {
        this.messageHandlers.add(handler)
        return () => {
            this.messageHandlers.delete(handler)
        }
    }

    onStatusChange(handler: StatusHandler): () => void {
        this.statusHandlers.add(handler)
        return () => {
            this.statusHandlers.delete(handler)
        }
    }

    private setStatus(status: WsConnectionStatus, error?: Event): void {
        for (const handler of this.statusHandlers) {
            try {
                handler(status, error)
            } catch {
                // ignore handler errors
            }
        }
    }

    private handleMessage(rawData: unknown): void {
        let message: WsMessage

        try {
            if (typeof rawData !== 'string') {
                throw new Error('Некорректный формат сообщения')
            }
            message = JSON.parse(rawData) as WsMessage
        } catch {
            return
        }

        for (const handler of this.messageHandlers) {
            try {
                handler(message)
            } catch {
                // ignore handler errors
            }
        }
    }

    private scheduleReconnect(): void {
        if (this.isDisposed) return

        this.clearReconnectTimer()

        const delay = Math.min(this.reconnectBaseDelayMs * 2 ** this.reconnectAttempts, this.maxReconnectDelayMs)
        this.reconnectAttempts += 1

        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null
            this.connect()
        }, delay)
    }

    private clearReconnectTimer(): void {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer)
            this.reconnectTimer = null
        }
    }

    private startHeartbeat(): void {
        this.stopHeartbeat()
        this.heartbeatTimer = setInterval(() => {
            this.send('ping', { timestamp: Date.now() })
        }, this.heartbeatIntervalMs)
    }

    private stopHeartbeat(): void {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer)
            this.heartbeatTimer = null
        }
    }
}
