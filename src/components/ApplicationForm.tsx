'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ApplicationForm({ onAdded }: { onAdded: () => void }) {
  const [company, setCompany] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('applications')
      .insert({ company, job_description: jobDescription })

    if (error) {
      console.error(error)
    } else {
      setCompany('')
      setJobDescription('')
      onAdded()
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
      <input
        className="border rounded-lg p-3 text-sm"
        placeholder="Company name"
        value={company}
        onChange={e => setCompany(e.target.value)}
        required
      />
      <textarea
        className="border rounded-lg p-3 text-sm h-36"
        placeholder="Paste job description here..."
        value={jobDescription}
        onChange={e => setJobDescription(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white rounded-lg p-3 text-sm font-medium disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Add Application'}
      </button>
    </form>
  )
}