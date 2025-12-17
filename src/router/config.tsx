import type { RouteObject } from 'react-router-dom'
import * as pages from '@/pages'
import { ProtectedRoute, PublicRoute } from '@/shared/lib/router'

const createProtectedRoute = (path: string, element: React.ReactElement): RouteObject => ({
  path,
  element: <ProtectedRoute>{element}</ProtectedRoute>,
})

const createPublicRoute = (path: string, element: React.ReactElement): RouteObject => ({
  path,
  element: <PublicRoute>{element}</PublicRoute>,
})

const routes: RouteObject[] = [
  createPublicRoute('/', <pages.AuthPage />),
  createPublicRoute('/auth', <pages.AuthPage />),

  createProtectedRoute('/todos', <pages.TodosPage />),
  createProtectedRoute('/profile', <pages.ProfilePage />),
  createProtectedRoute('/groups', <pages.GroupsPage />),
  createProtectedRoute('/contact', <pages.ContactPage />),
  createProtectedRoute('/test-components', <pages.TestComponentsPage />),

  {
    path: '*',
    element: <pages.NotFoundPage />,
  },
]

export default routes
