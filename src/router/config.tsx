import type { RouteObject } from 'react-router-dom'
import * as pages from '@/pages'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <pages.HomePage />,
  },
  {
    path: '/auth',
    element: <pages.AuthPage />,
  },
  {
    path: '/todos',
    element: <pages.TodosPage />,
  },
  {
    path: '/profile',
    element: <pages.ProfilePage />,
  },
  {
    path: '/groups',
    element: <pages.GroupsPage />,
  },
  {
    path: '/contact',
    element: <pages.ContactPage />,
  },
  {
    path: '/test-components',
    element: <pages.TestComponentsPage />,
  },
  {
    path: '*',
    element: <pages.NotFoundPage />,
  },
]

export default routes
