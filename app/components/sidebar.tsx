'use client'

import React, { useState } from 'react'
import type { Chat } from '../lib/types'
import ChatList from './chat-list'
import NewChatDialog from './new-chat-dialog'

type SidebarProps = {
    activeChatId: string | null
    onSelectChat: (chat: Chat) => void
}

const Sidebar = ({ activeChatId, onSelectChat }: SidebarProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    function handleChatCreated(chat: Chat) {
        setIsDialogOpen(false)
        onSelectChat(chat)
    }

    return (
        <div className='flex w-64 shrink-0 flex-col border-r border-zinc-200 p-3 dark:border-zinc-800'>
            <div className='mb-3 flex items-center justify-between gap-2'>
                <button>Menu</button>
                <button
                    type='button'
                    onClick={() => setIsDialogOpen(true)}
                    title='Новый чат'
                    aria-label='Новый чат'
                    className='flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-lg font-medium text-background transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200'
                >
                    +
                </button>
            </div>

            <div className='flex-1 overflow-y-auto'>
                <ChatList activeChatId={activeChatId} onSelect={onSelectChat} />
            </div>

            {isDialogOpen && (
                <NewChatDialog
                    onClose={() => setIsDialogOpen(false)}
                    onChatCreated={handleChatCreated}
                />
            )}
        </div>
    )
}

export default Sidebar
