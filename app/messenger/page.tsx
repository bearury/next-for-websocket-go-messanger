'use client'

import { ConnectionStatus } from '@/app/components/connection-status'
import { MessageInput } from '@/app/components/message-input'
import { MessageList } from '@/app/components/message-list'
import { ProtectedRoute } from '@/app/components/protected-route'
import { getToken } from '@/app/lib/auth-store'
import { useAuth } from '@/app/lib/use-auth'
import { useMessenger } from '@/app/lib/use-messenger'
import Sidebar from '../components/sidebar'

function MessengerContent() {
    const token = getToken()
    const { logout } = useAuth()
    const { messages, status, sendMessage, reconnect } = useMessenger(token)

    const isConnected = status === 'open'

    return (
        <div className='flex h-screen flex-col bg-background'>
            <header className='flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800'>
                <h1 className='text-lg font-semibold'>Мессенджер</h1>

                <ConnectionStatus status={status} onReconnect={reconnect} />
                <button
                    type='button'
                    onClick={logout}
                    className='text-sm font-medium text-red-600 hover:underline dark:text-red-400'
                >
                    Выйти
                </button>
            </header>

            <div className='flex flex-1 flex-row gap-3 overflow-y-auto'>
                <Sidebar />
                <MessageList messages={messages} />
            </div>

            <MessageInput onSend={(content) => sendMessage(content)} disabled={!isConnected} />
        </div>
    )
}

export default function MessengerPage() {
    return (
        <ProtectedRoute>
            <MessengerContent />
        </ProtectedRoute>
    )
}
