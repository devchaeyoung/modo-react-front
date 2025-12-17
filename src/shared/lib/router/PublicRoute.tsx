import { Navigate } from 'react-router-dom'
import { useAuthStatus } from '@/entities/auth'
import { SHOULD_REPLACE_HISTORY } from './constants'

interface PublicRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export const PublicRoute = ({ children, redirectTo = '/todos' }: PublicRouteProps) => {
  const { isAuthenticated, isGuest } = useAuthStatus()

  if (isAuthenticated || isGuest) {
    return <Navigate to={redirectTo} replace={SHOULD_REPLACE_HISTORY} />
  }

  return <>{children}</>
}
