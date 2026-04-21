'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ApplicationForm({ onAdded }: { onAdded: () => void }) {
  const [company, setCompany] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setStatus('Analyzing job description...')

    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobDescription, company }),
    })

const text = await res.text()
console.log('Raw API response:', text)
const aiData = JSON.parse(text)
    setStatus('Saving to database...')

    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('AI data received:', aiData)

    const { error } = await supabase
      .from('applications')
      .insert({
        company,
        job_description: jobDescription,
        role: aiData.role,
        skills: aiData.skills,
        salary: aiData.salary,
        fit_score: aiData.fit_score,
        cover_letter: aiData.cover_letter,
      })

    if (error) {
      console.error(error)
      setStatus('Something went wrong.')
    } else {
      setCompany('')
      setJobDescription('')
      setStatus('')
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
        required
      />
      {status && <p className="text-sm text-gray-500">{status}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white rounded-lg p-3 text-sm font-medium disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'Add Application'}
      </button>
    </form>
  )
}