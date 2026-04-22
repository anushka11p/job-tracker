'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Application } from '@/lib/types'

export default function ApplicationList({ refresh }: { refresh: number }) {
  const [applications, setApplications] = useState<Application[]>([])
  const [selectedCoverLetter, setSelectedCoverLetter] = useState<string | null>(null)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setApplications(data)
    }
    fetch()
  }, [refresh])

  async function updateStatus(id: string, status: string) {
    await supabase.from('applications').update({ status }).eq('id', id)
    setApplications(prev =>
      prev.map(app => app.id === id ? { ...app, status } : app)
    )
  }

  function fitScoreColor(score: number | null) {
    if (!score) return { bg: '#555', color: '#aaa' }
    if (score >= 70) return { bg: '#00e676', color: '#1a1a1a' }
    if (score >= 40) return { bg: '#95b5a8', color: '#1a1a1a' }
    return { bg: '#6b5757', color: '#ffffff' }
  }

  function statusColor(status: string) {
    switch (status) {
      case 'Interview': return { bg: '#95b5a8', color: '#1a1a1a' }
      case 'Offer': return { bg: '#00e676', color: '#1a1a1a' }
      case 'Rejected': return { bg: '#6b5757', color: '#ffffff' }
      default: return { bg: '#3d3d3d', color: '#c5ddd6' }
    }
  }

  if (applications.length === 0) {
    return (
      <p style={{ color: '#95b5a8', fontSize: '14px' }}>No applications yet. Add your first one!</p>
    )
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {applications.map(app => (
          <div key={app.id} style={{
            backgroundColor: '#2d2d2d',
            border: '1px solid #6b5757',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontWeight: '700', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ffffff' }}>
                  {app.company}
                </p>
                <p style={{ color: '#95b5a8', fontSize: '13px', marginTop: '2px' }}>
                  {app.role ?? '—'}
                </p>
                {app.salary && (
                  <p style={{ color: '#c5ddd6', fontSize: '12px', marginTop: '4px' }}>
                    💰 {app.salary}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {app.fit_score && (
                  <span style={{
                    ...fitScoreColor(app.fit_score),
                    fontSize: '12px',
                    fontWeight: '700',
                    padding: '4px 10px',
                    borderRadius: '20px',
                  }}>
                    {app.fit_score}% fit
                  </span>
                )}
                <select
                  value={app.status}
                  onChange={e => updateStatus(app.id, e.target.value)}
                  style={{
                    ...statusColor(app.status),
                    border: 'none',
                    borderRadius: '20px',
                    padding: '4px 10px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <option>Applied</option>
                  <option>Interview</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                </select>
              </div>
            </div>

            {app.skills && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {app.skills.map(skill => (
                  <span key={skill} style={{
                    backgroundColor: '#3d3d3d',
                    border: '1px solid #95b5a8',
                    color: '#c5ddd6',
                    fontSize: '11px',
                    padding: '3px 10px',
                    borderRadius: '20px',
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {app.cover_letter && (
              <button
                onClick={() => setSelectedCoverLetter(app.cover_letter)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#95b5a8',
                  fontSize: '13px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  padding: 0,
                  textDecoration: 'underline',
                }}
              >
                View cover letter →
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedCoverLetter && (
        <div
          onClick={() => setSelectedCoverLetter(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            zIndex: 50,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#2d2d2d',
              border: '1px solid #6b5757',
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ color: '#c5ddd6', fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Cover Letter
              </h2>
              <button
                onClick={() => setSelectedCoverLetter(null)}
                style={{ background: 'none', border: 'none', color: '#95b5a8', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <p style={{ color: '#ffffff', fontSize: '14px', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {selectedCoverLetter}
            </p>
            <button
              onClick={() => navigator.clipboard.writeText(selectedCoverLetter)}
              style={{
                marginTop: '20px',
                backgroundColor: '#00e676',
                color: '#1a1a1a',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Copy to clipboard
            </button>
          </div>
        </div>
      )}
    </>
  )
}