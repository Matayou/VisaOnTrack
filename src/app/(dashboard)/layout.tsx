import React from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}