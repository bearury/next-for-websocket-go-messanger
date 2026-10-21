'use client'

import { useState } from 'react'
import { ConnectionStatus } from '@/app/components/connection-status'
import { MessageInput } from '@/app/components/message-input'
import { MessageList } from '@/app/components/message-list'
import { ProtectedRoute } from '@/app/components/protected-route'
import { useAuth } from '@/app/lib/use-auth'
import { useMessages } from '@/app/lib/use-messages'
import type { Chat } from '@/app/lib/types'
import Sidebar from '../components/sidebar'

function MessengerContent() {
    const { logout } = useAuth()
    const [activeChat, setActiveChat] = useState<Chat | null>(null)
    const { messages, status, sendMessage, reconnect } = useMessages(activeChat?.id ?? null)

    const isConnected = status === 'open'

    return (
        <div className='flex h-screen flex-col bg-background'>
            <header className='flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800'>
                <h1 className='text-lg font-semibold'>
                    Мессенджер{activeChat ? ` — ${activeChat.name}` : ''}
                </h1>

                <ConnectionStatus status={status} onReconnect={reconnect} />
                <button
                    type='button'
                    onClick={logout}
                    className='text-sm font-medium text-red-600 hover:underline dark:text-red-400'
                >
                    Выйти
                </button>
            </header>

            <div className='flex flex-1 overflow-hidden'>
                <Sidebar activeChatId={activeChat?.id ?? null} onSelectChat={setActiveChat} />

                <div className='flex min-w-0 flex-1 flex-col'>
                    <MessageList messages={messages} hasActiveChat={activeChat !== null} />
                    <MessageInput
                        sendMessageAction={sendMessage}
                        disabled={!isConnected || activeChat === null}
                        focusSignal={activeChat?.id ?? null}
                    />
                </div>
            </div>
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
