'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { extractToken, signIn, signUp } from './auth-client'
import { removeToken, saveToken } from './auth-store'
import { queryKeys } from './query-keys'
import { useToken } from './use-token'
import type { SignInRequest, SignUpRequest } from './types'

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message
    return 'Произошла неизвестная ошибка'
}

export function useAuth() {
    const router = useRouter()
    const token = useToken()
    const queryClient = useQueryClient()

    const saveSession = useCallback(
        (newToken: string) => {
            saveToken(newToken)
            void queryClient.invalidateQueries({ queryKey: queryKeys.me })
            router.push('/messenger')
        },
        [queryClient, router],
    )

    const signInMutation = useMutation({
        mutationFn: async (credentials: SignInRequest) =>
            extractToken(await signIn(credentials)),
        onSuccess: saveSession,
    })

    const signUpMutation = useMutation({
        mutationFn: async (credentials: SignUpRequest) =>
            extractToken(await signUp(credentials)),
        onSuccess: saveSession,
    })

    const login = useCallback(
        (credentials: SignInRequest) => {
            signInMutation.mutate(credentials)
        },
        [signInMutation],
    )

    const register = useCallback(
        (credentials: SignUpRequest) => {
            signUpMutation.mutate(credentials)
        },
        [signUpMutation],
    )

    const logout = useCallback(() => {
        removeToken()
        queryClient.clear()
        router.push('/sign-in')
    }, [queryClient, router])

    const clearError = useCallback(() => {
        signInMutation.reset()
        signUpMutation.reset()
    }, [signInMutation, signUpMutation])

    const error = signInMutation.error ?? signUpMutation.error

    return {
        isAuthenticated: token !== null,
        token,
        login,
        register,
        logout,
        isLoading: signInMutation.isPending || signUpMutation.isPending,
        error: error ? getErrorMessage(error) : null,
        clearError,
    }
}
