'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createChat, fetchMe, searchUsers } from '../lib/chat-client'
import type { CreateChatResponse, User } from '../lib/types'

type NewChatDialogProps = {
    token: string
    onClose: () => void
    onChatCreated: (chat: CreateChatResponse) => void
}

export default function NewChatDialog({ token, onClose, onChatCreated }: NewChatDialogProps) {
    const [search, setSearch] = useState('')
    const [users, setUsers] = useState<User[]>([])
    const [me, setMe] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [creatingUserId, setCreatingUserId] = useState<string | null>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        searchInputRef.current?.focus()
        fetchMe(token).then(setMe).catch(() => setMe(null))
    }, [token])

    useEffect(() => {
        const trimmed = search.trim()
        const timer = setTimeout(() => {
            setIsLoading(true)
            searchUsers(token, trimmed)
                .then(setUsers)
                .catch((err) => setError(err instanceof Error ? err.message : 'Ошибка загрузки пользователей'))
                .finally(() => setIsLoading(false))
        }, 300)

        return () => clearTimeout(timer)
    }, [search, token])

    async function handleSelectUser(user: User) {
        if (!me || creatingUserId) return

        setCreatingUserId(user.id)
        setError(null)

        try {
            const chat = await createChat(token, {
                name: `${me.username}-${user.username}`,
                type: 'chat',
                userIds: [user.id],
            })
            onChatCreated(chat)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Не удалось создать чат')
            setCreatingUserId(null)
        }
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
                    className='mb-3 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800'
                />

                <div className='max-h-64 overflow-y-auto'>
                    {isLoading && <div className='py-4 text-center text-sm text-zinc-400'>Загрузка...</div>}

                    {!isLoading && error && <div className='py-4 text-center text-sm text-red-500'>{error}</div>}

                    {!isLoading && !error && users.length === 0 && (
                        <div className='py-4 text-center text-sm text-zinc-400'>Пользователи не найдены</div>
                    )}

                    {!isLoading &&
                        users.map((user) => (
                            <button
                                key={user.id}
                                type='button'
                                disabled={creatingUserId !== null}
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
