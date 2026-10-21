'use client'

import { useEffect, useRef, useState } from 'react'
import type { Chat, User } from '../lib/types'
import { useCreateChatMutation } from '../lib/use-chats'
import { useMeQuery } from '../lib/use-me'
import { useUsersQuery } from '../lib/use-users'

type NewChatDialogProps = {
    onClose: () => void
    onChatCreated: (chat: Chat) => void
}

export default function NewChatDialog({ onClose, onChatCreated }: NewChatDialogProps) {
    const [search, setSearch] = useState('')
    const searchInputRef = useRef<HTMLInputElement>(null)
    const meQuery = useMeQuery()
    const usersQuery = useUsersQuery(search)
    const createChatMutation = useCreateChatMutation()

    useEffect(() => {
        searchInputRef.current?.focus()
    }, [])

    const me = meQuery.data
    const users = usersQuery.data ?? []
    const creatingUserId = createChatMutation.isPending
        ? createChatMutation.variables?.userIds[0] ?? null
        : null
    const error = createChatMutation.error ?? usersQuery.error

    function handleSelectUser(user: User) {
        if (!me || createChatMutation.isPending) return

        createChatMutation.mutate(
            {
                name: `${me.username}-${user.username}`,
                type: 'chat',
                userIds: [user.id],
            },
            { onSuccess: onChatCreated },
        )
    }

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'
            onClick={onClose}
        >
            <div
                className='w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-700 dark:bg-zinc-900'
                onClick={(e) => e.stopPropagation()}
            >
                <div className='mb-3 flex items-center justify-between'>
                    <h2 className='text-base font-semibold'>Новый чат</h2>
                    <button
                        type='button'
                        onClick={onClose}
                        className='text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
                        aria-label='Закрыть'
                    >
                        ✕
                    </button>
                </div>

                <input
                    ref={searchInputRef}
                    type='text'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder='Поиск пользователей...'
                    className='mb-3 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-800'
                />

                <div className='max-h-64 overflow-y-auto'>
                    {usersQuery.isFetching && (
                        <div className='py-2 text-center text-xs text-zinc-400'>Загрузка...</div>
                    )}

                    {error && (
                        <div className='py-2 text-center text-sm text-red-500'>
                            {error instanceof Error ? error.message : 'Ошибка загрузки пользователей'}
                        </div>
                    )}

                    {!usersQuery.isFetching && !error && users.length === 0 && (
                        <div className='py-4 text-center text-sm text-zinc-400'>
                            Пользователи не найдены
                        </div>
                    )}

                    {users.map((user) => (
                        <button
                            key={user.id}
                            type='button'
                            disabled={createChatMutation.isPending}
                            onClick={() => handleSelectUser(user)}
                            className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-zinc-100 disabled:opacity-50 dark:hover:bg-zinc-800'
                        >
                            <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 font-medium uppercase dark:bg-zinc-700'>
                                {user.username[0]}
                            </span>
                            <span className='truncate'>{user.username}</span>
                            {creatingUserId === user.id && (
                                <span className='ml-auto text-xs text-zinc-400'>Создание...</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
