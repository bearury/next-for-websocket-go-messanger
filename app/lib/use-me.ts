'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchMe } from './chat-client'
import { queryKeys } from './query-keys'
import { useToken } from './use-token'

export function useMeQuery() {
    const token = useToken()

    return useQuery({
        queryKey: queryKeys.me,
        queryFn: () => {
            if (!token) throw new Error('Требуется авторизация')
            return fetchMe(token)
        },
        enabled: token !== null,
        retry: false,
    })
}
