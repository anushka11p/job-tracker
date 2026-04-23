'use client'

import { useState } from 'react'
import ApplicationForm from '@/components/ApplicationForm'
import ApplicationList from '@/components/ApplicationList'
import ProfileForm from '@/components/ProfileForm'

export default function Home() {
  const [refresh, setRefresh] = useState(0)
  const [showForm, setShowForm] = useState(false)

  return (
    <main style={{ backgroundColor: '#3d3d3d', minHeight: '100vh' }} className="p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p style={{ color: '#95b5a8', fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Make your job search fun!
          </p>
          <h1 style={{
            fontSize: '52px',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            color: '#ffffff',
            textTransform: 'uppercase',
            marginBottom: '24px'
          }}>
            JOB-TRACKER
          </h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowForm(s => !s)}
              style={{
                backgroundColor: showForm ? '#6b5757' : '#00e676',
                color: showForm ? '#ffffff' : '#1a1a1a',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '14px',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                textTransform: 'uppercase',
              }}
            >
              {showForm ? 'Cancel' : '+ Add Job'}
            </button>
          </div>
        </div>

        <ProfileForm />

        {showForm && <ApplicationForm onAdded={() => { setRefresh(r => r + 1); setShowForm(false) }} />}

        <ApplicationList refresh={refresh} />
      </div>
    </main>
  )
}