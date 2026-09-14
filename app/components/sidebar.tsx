'use client'

import React, { useState } from 'react'
import ChatList from './chat-list'
import NewChatDialog from './new-chat-dialog'
import type { CreateChatResponse } from '../lib/types'

type SidebarProps = {
    token: string
    onChatCreated: (chat: CreateChatResponse) => void
}

const Sidebar = ({ token, onChatCreated }: SidebarProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    function handleChatCreated(chat: CreateChatResponse) {
        setIsDialogOpen(false)
        onChatCreated(chat)
    }

    return (
        <div className='border-r border-zinc-200 p-3 dark:border-zinc-800'>
            <div className='mb-3 flex items-center justify-between'>
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
            <ChatList />

            {isDialogOpen && (
                <NewChatDialog
                    token={token}
                    onClose={() => setIsDialogOpen(false)}
                    onChatCreated={handleChatCreated}
                />
            )}
        </div>
    )
}

export default Sidebar
