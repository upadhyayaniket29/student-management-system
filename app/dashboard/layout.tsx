'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { authAPI } from '@/lib/api'
import { isAuthenticated } from '@/lib/auth'
import { Skeleton } from '@/components/ui/skeleton'

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      if (!isAuthenticated()) {
        router.push('/auth/login')
        return
      }

      try {
        const response = await authAPI.getMe()
        setUser(response.data)
      } catch (error) {
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <DashboardLayout user={user}>{children}</DashboardLayout>
}
