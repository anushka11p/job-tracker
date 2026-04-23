'use client'

import { useState, useEffect } from 'react'

export default function ProfileForm() {
  const [skills, setSkills] = useState('')
  const [experience, setExperience] = useState('')
  const [saved, setSaved] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const s = localStorage.getItem('user_skills')
    const e = localStorage.getItem('user_experience')
    if (s) setSkills(s)
    if (e) setExperience(e)
  }, [])

  function save() {
    localStorage.setItem('user_skills', skills)
    localStorage.setItem('user_experience', experience)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inputStyle = {
    width: '100%',
    backgroundColor: '#3d3d3d',
    border: '1px solid #6b5757',
    borderRadius: '8px',
    padding: '12px',
    color: '#ffffff',
    fontSize: '13px',
    outline: 'none',
  }

  return (
    <div style={{ marginBottom: '32px' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'none',
          border: '1px solid #6b5757',
          color: '#95b5a8',
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '13px',
          cursor: 'pointer',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        {open ? 'Close Profile' : '👤 My Profile'}
      </button>

      {open && (
        <div style={{
          marginTop: '12px',
          backgroundColor: '#2d2d2d',
          border: '1px solid #6b5757',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          <div>
            <p style={{ color: '#95b5a8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
              Skills
            </p>
            <input
              style={inputStyle}
              placeholder="e.g. React, Next.js, TypeScript, Python, SQL"
              value={skills}
              onChange={e => setSkills(e.target.value)}
            />
          </div>
          <div>
            <p style={{ color: '#95b5a8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
              Experience
            </p>
            <textarea
              style={{ ...inputStyle, height: '100px', resize: 'none' }}
              placeholder="e.g. 2 years frontend dev, built 3 SaaS apps, computer science graduate"
              value={experience}
              onChange={e => setExperience(e.target.value)}
            />
          </div>
          <button
            onClick={save}
            style={{
              backgroundColor: saved ? '#95b5a8' : '#00e676',
              color: '#1a1a1a',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
          >
            {saved ? 'Saved ✓' : 'Save Profile'}
          </button>
        </div>
      )}
    </div>
  )
}