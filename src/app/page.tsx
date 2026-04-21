'use client'

import { useState } from 'react'
import ApplicationForm from '@/components/ApplicationForm'
import ApplicationList from '@/components/ApplicationList'

export default function Home() {
  const [refresh, setRefresh] = useState(0)
  const [showForm, setShowForm] = useState(false)

  return (
    <main className="max-w-2xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Job Tracker</h1>
          <p className="text-sm text-gray-500 mt-1">AI-powered application tracker</p>
        </div>
        <button
          onClick={() => setShowForm(s => !s)}
          className="bg-black text-white text-sm px-4 py-2 rounded-lg"
        >
          {showForm ? 'Cancel' : '+ Add Job'}
        </button>
      </div>

      {showForm && (
        <ApplicationForm onAdded={() => { setRefresh(r => r + 1); setShowForm(false) }} />
      )}

      <ApplicationList refresh={refresh} />
    </main>
  )
}