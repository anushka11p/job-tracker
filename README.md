# AI powered Job Tracker 

An AI-powered job application tracker that extracts key info from job descriptions and generates tailored cover letters automatically.

## Features

- **AI-powered extraction** — paste a job description and instantly get role, top skills, salary range, and a fit score
- **Cover letter generation** — AI writes a tailored cover letter for each application
- **Status tracking** — track every application through Applied, Interview, Offer, and Rejected
- **Persistent storage** — all applications saved to Supabase with real-time updates

## Tech Stack

- [Next.js 16](https://nextjs.org/) — React framework with App Router
- [Supabase](https://supabase.com/) — PostgreSQL database with Row Level Security
- [Groq](https://groq.com/) — free, fast AI inference (Llama 3.3 70B)
- [Tailwind CSS](https://tailwindcss.com/) — utility-first styling

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/job-tracker.git
cd job-tracker
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the root:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
GROQ_API_KEY=gsk_...
```

### 3. Set up Supabase

Create a table called `applications` by running this in the Supabase SQL Editor:

```sql
create table applications (
  id uuid default gen_random_uuid() primary key,
  company text not null,
  role text,
  job_description text,
  skills text[],
  salary text,
  fit_score int,
  cover_letter text,
  status text default 'Applied',
  created_at timestamp default now()
);

create policy "allow all" on applications
for all
using (true)
with check (true);
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

1. Click **+ Add Job**
2. Enter the company name and paste the job description
3. Hit **Add Application** — AI analyzes the description in a few seconds
4. View the extracted role, skills, salary, and fit score on the card
5. Click **View cover letter →** to see and copy the generated cover letter
6. Use the dropdown to update the application status as you progress

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts      # AI extraction + cover letter API route
│   ├── page.tsx              # Main page
│   └── layout.tsx
├── components/
│   ├── ApplicationForm.tsx   # Job submission form
│   └── ApplicationList.tsx   # Application cards with status + modal
└── lib/
    ├── supabase.ts           # Supabase client
    └── types.ts              # TypeScript types
```

## API Keys

| Service | Where to get it | Cost |
|---------|----------------|------|
| Supabase | [supabase.com](https://supabase.com) | Free |
| Groq | [console.groq.com](https://console.groq.com) | Free |
