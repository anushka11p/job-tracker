'use client'

import { useState } from 'react'
import ApplicationForm from '@/components/ApplicationForm'
import ApplicationList from '@/components/ApplicationList'

export default function Home() {
  const [refresh, setRefresh] = useState(0)

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Job Tracker</h1>
      <ApplicationForm onAdded={() => setRefresh(r => r + 1)} />
      <ApplicationList refresh={refresh} />
    </main>
  )
}