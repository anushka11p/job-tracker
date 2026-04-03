export type Application = {
  id: string
  company: string
  role: string | null
  job_description: string | null
  skills: string[] | null
  salary: string | null
  fit_score: number | null
  cover_letter: string | null
  status: string
  created_at: string
}