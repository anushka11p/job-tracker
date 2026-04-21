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
    if (!score) return 'bg-gray-100 text-gray-500'
    if (score >= 70) return 'bg-green-100 text-green-700'
    if (score >= 40) return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }

  if (applications.length === 0) {
    return <p className="text-gray-400 text-sm">No applications yet.</p>
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {applications.map(app => (
          <div key={app.id} className="border rounded-lg p-4 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{app.company}</p>
                <p className="text-sm text-gray-500">{app.role ?? '—'}</p>
                {app.salary && (
                  <p className="text-xs text-gray-400 mt-1">💰 {app.salary}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {app.fit_score && (
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${fitScoreColor(app.fit_score)}`}>
                    {app.fit_score}% fit
                  </span>
                )}
                <select
                  value={app.status}
                  onChange={e => updateStatus(app.id, e.target.value)}
                  className="text-xs border rounded-lg px-2 py-1 bg-transparent"
                >
                  <option>Applied</option>
                  <option>Interview</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                </select>
              </div>
            </div>
            {app.skills && (
              <div className="flex flex-wrap gap-1">
                {app.skills.map(skill => (
                  <span key={skill} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            )}
            {app.cover_letter && (
              <button
                onClick={() => setSelectedCoverLetter(app.cover_letter)}
                className="text-xs text-left text-blue-500 hover:underline"
              >
                View cover letter →
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedCoverLetter && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedCoverLetter(null)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Cover Letter</h2>
              <button
                onClick={() => setSelectedCoverLetter(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedCoverLetter}</p>
            <button
              onClick={() => navigator.clipboard.writeText(selectedCoverLetter)}
              className="mt-4 text-xs bg-black text-white px-4 py-2 rounded-lg"
            >
              Copy to clipboard
            </button>
          </div>
        </div>
      )}
    </>
  )
}