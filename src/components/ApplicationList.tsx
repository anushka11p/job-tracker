'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Application } from '@/lib/types'

export default function ApplicationList({ refresh }: { refresh: number }) {
  const [applications, setApplications] = useState<Application[]>([])

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

  if (applications.length === 0) {
    return <p className="text-gray-400 text-sm">No applications yet.</p>
  }

  return (
    <div className="flex flex-col gap-3">
      {applications.map(app => (
        <div key={app.id} className="border rounded-lg p-4 flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{app.company}</p>
              <p className="text-sm text-gray-500">{app.role ?? '—'}</p>
            </div>
            <div className="flex items-center gap-2">
              {app.fit_score && (
                <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {app.fit_score}% fit
                </span>
              )}
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {app.status}
              </span>
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
          {app.salary && (
            <p className="text-xs text-gray-400">Salary: {app.salary}</p>
          )}
        </div>
      ))}
    </div>
  )
}