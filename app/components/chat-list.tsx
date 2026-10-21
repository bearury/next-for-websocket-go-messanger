'use client'

import type { Chat } from '../lib/types'
import { useChatsQuery } from '../lib/use-chats'

type ChatListProps = {
    activeChatId: string | null
    onSelect: (chat: Chat) => void
}

const chatTypeLabel: Record<Chat['type'], string> = {
    chat: 'личный',
    group: 'группа',
    chain: 'цепочка',
}

export default function ChatList({ activeChatId, onSelect }: ChatListProps) {
    const { data: chats, error, isError, isPending, refetch } = useChatsQuery()

    if (isPending) {
        return <div className='px-2 py-4 text-sm text-zinc-400'>Загрузка чатов...</div>
    }

    if (isError) {
        return (
            <div className='flex flex-col gap-2 px-2 py-4 text-sm text-red-500'>
                <span>{error instanceof Error ? error.message : 'Не удалось загрузить чаты'}</span>
                <button
                    type='button'
                    onClick={() => void refetch()}
                    className='self-start font-medium text-blue-600 hover:underline dark:text-blue-400'
                >
                    Повторить
                </button>
            </div>
        )
    }

    if (chats.length === 0) {
        return (
            <div className='px-2 py-4 text-sm text-zinc-400'>
                Чатов пока нет. Создайте новый.
            </div>
        )
    }

    return (
        <ul className='flex flex-col gap-1'>
            {chats.map((chat) => {
                const isActive = chat.id === activeChatId

                return (
                    <li key={chat.id}>
                        <button
                            type='button'
                            onClick={() => onSelect(chat)}
                            aria-current={isActive ? 'true' : undefined}
                            className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors ${
                                isActive
                                    ? 'bg-foreground text-background'
                                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                            }`}
                        >
                            <span
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-medium uppercase ${
                                    isActive
                                        ? 'bg-background/20 text-background'
                                        : 'bg-zinc-200 dark:bg-zinc-700'
                                }`}
                            >
                                {chat.name[0] ?? '?'}
                            </span>
                            <span className='min-w-0 flex-1 truncate'>{chat.name}</span>
                            <span className='shrink-0 text-[10px] uppercase opacity-60'>
                                {chatTypeLabel[chat.type]}
                            </span>
                        </button>
                    </li>
                )
            })}
        </ul>
    )
}
