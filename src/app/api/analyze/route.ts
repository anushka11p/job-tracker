import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    console.log('API key exists:', !!process.env.GROQ_API_KEY)

    const { jobDescription, company, skills, experience } = await req.json()

    const extractRes = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a job application assistant. Return ONLY valid JSON, no markdown, no backticks, no explanation.',
        },
        {
          role: 'user',
          content: `Extract the following from this job description and return as JSON:
- role (job title)
- skills (array of top 5 required skills from the job)
- salary (estimated range as string, or null if not mentioned)
- fit_score (integer 1-100 based on how well the candidate matches the job. If no candidate info provided, return 50)

${skills ? `Candidate skills: ${skills}\n` : ''}
${experience ? `Candidate experience: ${experience}\n` : ''}
Job description:
${jobDescription}`,
        },
      ],
    })

    const extractedText = extractRes.choices[0].message.content || '{}'
    const extracted = JSON.parse(extractedText)

    const coverRes = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an expert cover letter writer. Write concise, compelling cover letters.',
        },
        {
          role: 'user',
          content: `Write a cover letter for this job at ${company}.${skills ? ` Candidate skills: ${skills}.` : ''}${experience ? ` Experience: ${experience}.` : ''} Job description: ${jobDescription}`,
        },
      ],
    })

    const coverLetter = coverRes.choices[0].message.content || ''

    return NextResponse.json({ ...extracted, cover_letter: coverLetter })

  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}