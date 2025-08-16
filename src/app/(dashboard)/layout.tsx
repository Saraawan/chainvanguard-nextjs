// src/app/(dashboard)/layout.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { DashboardHeader } from '@/components/common/dashboard-header'
import { DashboardSidebar } from '@/components/common/dashboard-sidebar'
import { LoadingSpinner } from '@/components/common/loading-spinner'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Wait until loading finishes
    if (!isLoading) {
      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        router.push('/login')
        return
      }

      // If user has no role yet, redirect to role selection
      if (isAuthenticated && !user?.role) {
        router.push('/role-selection')
        return
      }
    }
  }, [isAuthenticated, isLoading, user, router])

  // Show loading spinner while auth/user is loading
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  // Fallback in case user is not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 ml-64 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
