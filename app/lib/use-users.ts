'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { searchUsers } from './chat-client'
import { queryKeys } from './query-keys'
import { useToken } from './use-token'

function useDebouncedValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay)
        return () => clearTimeout(timer)
    }, [value, delay])

    return debouncedValue
}

export function useUsersQuery(search: string) {
    const token = useToken()
    const debouncedSearch = useDebouncedValue(search.trim(), 300)

    return useQuery({
        queryKey: queryKeys.users(debouncedSearch),
        queryFn: () => {
            if (!token) throw new Error('Требуется авторизация')
            return searchUsers(token, debouncedSearch)
        },
        enabled: token !== null,
        placeholderData: keepPreviousData,
    })
}
