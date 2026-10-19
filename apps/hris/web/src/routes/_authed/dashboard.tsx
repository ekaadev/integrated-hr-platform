import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hr/ui'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { api } from '../../lib/api'
import { authClient } from '../../lib/auth-client'
import { config } from '../../lib/config'

export const Route = createFileRoute('/_authed/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const { user } = Route.useRouteContext()
  const router = useRouter()

  const health = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const { data, error } = await api.v1.health.get()
      if (error) throw error
      return data
    },
  })

  const signOut = async () => {
    await authClient.signOut()
    await router.navigate({ to: '/login' })
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl">{config.appTitle}</h1>
          <p className="text-muted-foreground text-sm">Masuk sebagai {user.email}</p>
        </div>
        <Button variant="outline" onClick={signOut}>
          Keluar
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Status API</CardTitle>
          <CardDescription>GET /v1/health lewat Eden Treaty</CardDescription>
        </CardHeader>
        <CardContent>
          {health.isPending && <p>Memuat…</p>}
          {health.isError && <p className="text-destructive">Gagal menghubungi API.</p>}
          {health.data && (
            <dl className="grid grid-cols-2 gap-2 text-sm" data-testid="health">
              <dt className="text-muted-foreground">Status</dt>
              <dd>{health.data.status}</dd>
              <dt className="text-muted-foreground">Database</dt>
              <dd>{health.data.database}</dd>
              <dt className="text-muted-foreground">Data Contract</dt>
              <dd>v{health.data.contract_version}</dd>
            </dl>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
