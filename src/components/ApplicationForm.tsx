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

    const aiData = await res.json()
    setStatus('Saving to database...')

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

  const inputStyle = {
    backgroundColor: '#2d2d2d',
    border: '1px solid #6b5757',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#ffffff',
    fontSize: '14px',
    width: '100%',
    outline: 'none',
  }

  return (
    <div style={{
      backgroundColor: '#6b5757',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '32px',
    }}>
      <h2 style={{ color: '#c5ddd6', fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
        New Application
      </h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          style={inputStyle}
          placeholder="Company name"
          value={company}
          onChange={e => setCompany(e.target.value)}
          required
        />
        <textarea
          style={{ ...inputStyle, height: '140px', resize: 'none' }}
          placeholder="Paste job description here..."
          value={jobDescription}
          onChange={e => setJobDescription(e.target.value)}
          required
        />
        {status && (
          <p style={{ color: '#c5ddd6', fontSize: '13px' }}>{status}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: loading ? '#555' : '#00e676',
            color: '#1a1a1a',
            border: 'none',
            padding: '12px',
            borderRadius: '8px',
            fontWeight: '700',
            fontSize: '14px',
            cursor: loading ? 'not-allowed' : 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {loading ? 'Analyzing...' : 'Add Application'}
        </button>
      </form>
    </div>
  )
}