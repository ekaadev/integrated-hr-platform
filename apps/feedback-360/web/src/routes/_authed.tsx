import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { authClient } from '../lib/auth-client'

// Auth guard di level route: semua route di bawah _authed/ membutuhkan session.
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
