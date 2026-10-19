import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { authClient } from '../lib/auth-client'

// Route-level auth guard: every route under _authed/ requires a session.
export const Route = createFileRoute('/_authed')({
  beforeLoad: async ({ location }) => {
    const { data } = await authClient.getSession()
    if (!data) {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }
    return { user: data.user }
  },
  component: () => <Outlet />,
})
