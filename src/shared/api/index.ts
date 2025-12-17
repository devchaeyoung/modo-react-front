export { apiClient } from './client'
export * from './interceptors'
export type { ApiError } from './interceptors'

export const queryConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount: number, error: unknown) => {
        if (!error || typeof error !== 'object') return false

        const apiError = error as { status?: number }

        if (apiError.status && apiError.status >= 400 && apiError.status < 500) {
          return false
        }

        return failureCount < 3
      },
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
    mutations: {
      retry: false,
    },
  },
}

export const buildEndpoint = (...parts: (string | number)[]) => {
  return parts.map((p) => String(p).replace(/^\/|\/$/g, '')).join('/')
}

export const authStorage = {
  token: {
    get: () => localStorage.getItem('auth_token'),
    set: (token: string) => localStorage.setItem('auth_token', token),
    clear: () => localStorage.removeItem('auth_token'),
  },

  user: {
    get: () => {
      const data = localStorage.getItem('user')
      if (!data) return null
      try {
        return JSON.parse(data)
      } catch {
        return null
      }
    },
    set: (user: { username: string; role: string }) => {
      localStorage.setItem('user', JSON.stringify(user))
    },
    clear: () => localStorage.removeItem('user'),
  },

  guest: {
    get: () => localStorage.getItem('guestMode') === 'true',
    set: () => localStorage.setItem('guestMode', 'true'),
    clear: () => localStorage.removeItem('guestMode'),
  },

  clearAll: () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    localStorage.removeItem('guestMode')
  },
}

export const tokenManager = authStorage.token
