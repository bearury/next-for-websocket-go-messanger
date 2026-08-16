'use client'

import type { WsConnectionStatus } from '@/app/lib/types'

const statusConfig: Record<WsConnectionStatus, { label: string; color: string }> = {
    idle: { label: 'Ожидание', color: 'bg-zinc-400' },
    connecting: { label: 'Подключение', color: 'bg-yellow-500' },
    open: { label: 'Подключено', color: 'bg-green-500' },
    closing: { label: 'Отключение', color: 'bg-orange-500' },
    closed: { label: 'Отключено', color: 'bg-red-500' },
    error: { label: 'Ошибка', color: 'bg-red-600' },
}

export function ConnectionStatus({ status, onReconnect }: { status: WsConnectionStatus; onReconnect?: () => void }) {
    const config = statusConfig[status]

    return (
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
                <span className={`h-2.5 w-2.5 rounded-full ${config.color}`} aria-hidden='true' />
                <span className='text-sm font-medium'>{config.label}</span>
            </div>
            {(status === 'closed' || status === 'error') && onReconnect && (
                <button
                    type='button'
                    onClick={onReconnect}
                    className='text-sm font-medium text-blue-600 hover:underline dark:text-blue-400'
                >
                    Переподключиться
                </button>
            )}
        </div>
    )
}
