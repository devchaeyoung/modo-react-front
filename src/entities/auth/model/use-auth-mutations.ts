import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi, type LoginRequest, type SignupRequest } from '../api/auth-api'
import { handleApiError, authStorage } from '@/shared/api'
import { authKeys } from './keys'

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (data) => {
      if (!data) return

      authStorage.user.set({
        username: data.username,
        role: data.role,
      })

      queryClient.invalidateQueries({ queryKey: authKeys.all })

      if (import.meta.env.DEV) {
        console.log('Login successful:', data.username)
      }
    },
    onError: (error) => {
      handleApiError(error)
      if (import.meta.env.DEV) {
        console.error('Login failed:', error)
      }
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear()

      if (import.meta.env.DEV) {
        console.log('Logout successful')
      }
    },
    onError: (error) => {
      authStorage.clearAll()
      queryClient.clear()

      handleApiError(error)
      if (import.meta.env.DEV) {
        console.error('Logout failed:', error)
      }
    },
  })
}

export function useSignupWithAutoLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: SignupRequest & { password: string }) => {
      const signupData = await authApi.signup(data)

      const loginData = await authApi.login({
        username: data.username,
        password: data.password,
      })

      return { signup: signupData, login: loginData }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.all })
      if (import.meta.env.DEV) {
        console.log('Signup and auto-login successful')
      }
    },
    onError: (error) => {
      handleApiError(error)
      if (import.meta.env.DEV) {
        console.error('Signup or auto-login failed:', error)
      }
    },
  })
}
