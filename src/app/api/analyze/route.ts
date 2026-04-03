import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: NextRequest) {
  try {
    console.log('API key exists:', !!process.env.GEMINI_API_KEY)

    const { jobDescription, company } = await req.json()

const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' })

    const extractRes = await model.generateContent(`
      You are a job application assistant. Extract the following from this job description and return ONLY valid JSON, no markdown, no backticks, no explanation:
      - role (job title)
      - skills (array of top 5 skills)
      - salary (estimated range as string, or null if not mentioned)
      - fit_score (integer 1-100 based on how clear and strong the role is)

      Job description:
      ${jobDescription}
    `)

    const extractedText = extractRes.response.text()
    .replace(/```json/g, '')
  .replace(/```/g, '')
  .trim()
    const extracted = JSON.parse(extractedText)

    const coverRes = await model.generateContent(`
      Write a concise, compelling cover letter for this job at ${company}.
      Job description: ${jobDescription}
    `)

    const coverLetter = coverRes.response.text()

    return NextResponse.json({ ...extracted, cover_letter: coverLetter })

  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}