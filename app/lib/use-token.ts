'use client'

import { useSyncExternalStore } from 'react'
import { getToken, subscribeToken } from './auth-store'

/**
 * Токен из localStorage как реактивный источник.
 * Серверный снапшот всегда null, чтобы не ломать гидратацию.
 */
export function useToken(): string | null {
    return useSyncExternalStore(subscribeToken, getToken, () => null)
}
