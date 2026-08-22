import { SignIn } from '@clerk/tanstack-react-start'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sign-in/$')({
  // Splat route: Clerk butuh sub-path (/sign-in/factor-one, /sign-in/sso-callback)
  // buat MFA dan callback OAuth, jadi jangan diganti jadi route biasa.
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  component: SignInPage,
})

function SignInPage() {
  const { redirect } = Route.useSearch()

  return (
    <main className="page-wrap flex justify-center px-4 py-12">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        forceRedirectUrl={redirect ?? '/'}
      />
    </main>
  )
}
