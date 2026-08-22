import { auth } from '@clerk/tanstack-react-start/server'
import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'

/**
 * Baca session Clerk dari request. Cuma jalan di server — `auth()` ambil state
 * yang sudah ditaruh `clerkMiddleware()` di start.ts, jadi ini gagal kalau
 * middleware-nya dicabut.
 */
export const fetchClerkAuth = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { userId } = await auth()

    return { userId }
  },
)

/**
 * Guard buat `beforeLoad`. Dipanggil saat SSR maupun navigasi client, jadi
 * halaman yang diproteksi nggak pernah sempat ke-render buat visitor anonim.
 */
export async function requireAuth(href: string) {
  const { userId } = await fetchClerkAuth()

  if (!userId) {
    throw redirect({
      to: '/sign-in/$',
      params: { _splat: '' },
      search: { redirect: href },
    })
  }

  return { userId }
}
