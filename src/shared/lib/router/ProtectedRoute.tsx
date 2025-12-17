import { Navigate } from 'react-router-dom'
import { useAuthStatus } from '@/entities/auth'
import { SHOULD_REPLACE_HISTORY } from './constants'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export const ProtectedRoute = ({ children, redirectTo = '/' }: ProtectedRouteProps) => {
  const { isAuthenticated, isGuest } = useAuthStatus()

  if (isAuthenticated || isGuest) {
    return <>{children}</>
  }

  return <Navigate to={redirectTo} replace={SHOULD_REPLACE_HISTORY} />
}
