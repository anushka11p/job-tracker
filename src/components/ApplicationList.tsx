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
        <div key={app.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{app.company}</p>
              <p className="text-sm text-gray-500">{app.role ?? 'Role not analyzed yet'}</p>
            </div>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {app.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}