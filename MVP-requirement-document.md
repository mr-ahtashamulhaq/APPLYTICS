## Applytics MVP Requirement Document

### 1. Product definition

Applytics is a Pakistan-focused resume tailoring and application tracking web app for students, fresh graduates, and early-career job seekers.

The MVP does one core thing well:

It takes a user profile plus a job description and generates an ATS-friendly, tailored resume in a fixed LaTeX template, then saves the application in a tracking dashboard.

The MVP does **not** scrape jobs, auto-apply to external platforms, or run multi-agent workflows. The product is a deterministic pipeline with one LLM step in the middle.

---

### 2. MVP goal

The MVP must prove three things:

1. Users can quickly enter their profile and upload a resume.
2. The system can generate a strong tailored resume from a job description.
3. Users find the tracking dashboard useful enough to keep using the product.

Success for the MVP is not scale. Success is whether the user says, “This saves time and makes my resume better.”

---

### 3. Target users

Primary users:

* University students
* Fresh graduates
* Internship seekers
* Entry-level job seekers in Pakistan

Secondary users:

* Early-career professionals with 1 to 3 years of experience

The MVP should be built for low-budget, mobile-first, time-poor users.

---

### 4. Core MVP scope

The MVP should include only these four features:

#### A. User profile setup

A user creates a profile and enters:

* Name
* Email
* Phone number
* City
* Degree
* University
* Graduation status
* Skills
* Experience
* Projects
* Resume upload as PDF

This becomes the master source of truth for resume generation.

#### B. Job description input

Instead of scraping jobs, the user manually pastes:

* Job title
* Company name
* Job description
* Required skills if available

This avoids the complexity of scraping, platform integration, and job source maintenance.

#### C. ATS-friendly resume generator

This is the main feature.

The system must:

* Read the uploaded resume and profile
* Read the pasted job description
* Extract relevant keywords, responsibilities, and required skills
* Rewrite the resume using stronger language
* Apply the XYZ formula where possible, meaning:

  * what the user did
  * how they did it
  * what result it created
* Produce a single ATS-friendly resume in a fixed LaTeX template
* Generate a match score
* Suggest missing skills or weak spots

Important rule:
The system must not invent achievements, skills, employment history, or impact numbers the user did not provide. It may rewrite, strengthen, reorder, and reframe, but not fabricate.

#### D. Application tracker

A simple dashboard to store manually added applications with statuses:

* Draft
* Applied
* Interview
* Rejected
* Accepted

Each record should include:

* Company
* Role
* Date
* Status
* Notes

---

### 5. What is out of scope for the MVP

Do not build these in the first version:

* LinkedIn scraping
* Indeed scraping
* Facebook or WhatsApp job ingestion
* Automatic external job apply bots
* Payment gateway
* Recruiter portal
* Skill gap courses
* Interview coaching agent
* AI chat agent
* Multi-agent orchestration
* Vector database
* RAG pipeline
* Complex recommendation engine
* University integrations

These features are startup roadmap items, not MVP requirements.

---

### 6. User flow

The MVP user flow should be:

1. User opens landing page
2. User signs up or logs in
3. User creates profile
4. User uploads existing resume
5. User pastes job description
6. User clicks Generate Resume
7. System returns:

   * ATS-optimized resume
   * Match score
   * Keyword suggestions
   * Missing skills suggestions
8. User downloads PDF
9. User saves the opportunity in tracker
10. User updates application status over time

The flow must be understandable in under one minute during presentation.

---

### 7. Functional requirements

#### 7.1 Authentication

Users must be able to:

* Sign up
* Log in
* Log out
* Recover session

#### 7.2 Profile management

Users must be able to:

* Create profile
* Edit profile
* Upload resume PDF
* Save profile data

#### 7.3 Resume parsing

System must:

* Accept PDF resume upload
* Extract text from resume
* Convert resume content into structured data
* Handle imperfect formatting gracefully

#### 7.4 Job description parsing

System must:

* Accept pasted job description text
* Extract keywords
* Extract required skills
* Extract job title and role context

#### 7.5 Resume generation

System must:

* Produce one ATS-safe LaTeX resume
* Use a single internal template
* Avoid graphics, tables, icons, or decorative blocks
* Maintain clean section hierarchy
* Prefer one-column layout
* Output a PDF after compilation

#### 7.6 Resume rewriting logic

System must:

* Rewrite weak bullet points into stronger ones
* Reframe projects using impact-oriented language
* Reorder content based on relevance
* Add only user-supported content
* Highlight matching skills from the job description

#### 7.7 Match score

System must generate a score such as:

* 72%
* 84%
* 91%

The score should reflect keyword overlap, role match, and profile relevance.

#### 7.8 Missing skills suggestions

System must show a short list of:

* missing technical skills
* missing tools
* missing role-specific keywords

#### 7.9 Application tracker

System must let users:

* Add an application manually
* Update status
* Delete or edit records
* View all saved applications

---

### 8. Non-functional requirements

#### 8.1 Speed

The system should generate a resume in a reasonable demo-time window, ideally under one minute for average inputs.

#### 8.2 Simplicity

The MVP should feel clean and focused. No unnecessary navigation.

#### 8.3 ATS safety

The generated resume must avoid design elements that often break ATS parsing:

* tables
* columns
* text boxes
* heavy graphics
* unusual fonts
* decorative layouts

#### 8.4 Privacy

User resume data and profile data must be treated as sensitive.

#### 8.5 Reliability

If the LLM response fails, the app must show a clear error and retry option.

#### 8.6 Maintainability

The app should be easy to extend into a production platform later.

---

### 9. Recommended technical architecture

This architecture is intentionally simple.

Frontend:

* Next.js
* Tailwind CSS
* shadcn/ui

Backend:

* Next.js API routes or route handlers

Database:

* Supabase

Authentication:

* Clerk

AI:

* Groq API

File storage:

* Supabase Storage

Deployment:

* Vercel

This stack is practical because:

* Next.js App Router is file-system based and uses Server Components, Server Functions, and route handlers for full-stack work. ([Next.js][1])
* Tailwind is built around utility classes, which is good for fast MVP UI work. ([Tailwind CSS][2])
* shadcn/ui gives open-code, customizable components with strong defaults, which fits AI-assisted building tools well. ([Shadcn UI][3])
* Supabase provides a full Postgres database, auth, and storage, and its storage supports Row Level Security for file access control. ([Supabase][4])
* Clerk supports secure authentication for Next.js and provides prebuilt auth components and helpers. ([Clerk][5])
* Groq supports Structured Outputs that conform to JSON Schema, which is useful for returning clean resume data instead of messy free text. Groq also exposes an OpenAI-compatible base URL. ([GroqCloud][6])
* Vercel supports Next.js deployment, CI/CD, and serverless-style compute for web apps. ([Vercel][7])

---

### 10. Why no agentic AI in the MVP

Do not use LangChain or LangGraph in the MVP.

This is not an agent problem. It is a pipeline problem.

The flow is deterministic:

* parse resume
* parse job description
* build prompt
* call LLM
* receive structured JSON
* render into LaTeX template
* generate PDF
* store result

That is enough.

Agentic systems are a later-stage feature if you eventually add:

* job discovery
* external job aggregation
* automatic application workflows
* career coaching

For the MVP, avoid the extra complexity.

---

### 11. AI output specification

The AI must return structured data, not just prose.

Required output fields:

* summary
* skills_to_emphasize
* rewritten_projects
* rewritten_experience
* suggested_keywords
* missing_keywords
* match_score
* section_order_recommendation

Groq Structured Outputs is a good fit here because it can force model responses to conform to a JSON schema. ([GroqCloud][6])

Suggested flow:

1. Convert uploaded PDF resume to text.
2. Extract structured profile data.
3. Pass profile plus job description to LLM.
4. Receive JSON response.
5. Insert JSON into LaTeX template.
6. Compile PDF.
7. Save PDF and metadata.

---

### 12. Resume generation rules

The generated resume must:

* Be ATS-friendly
* Use one consistent template
* Be clean and single-column
* Be concise
* Prefer strong action verbs
* Use user-provided facts only
* Rewrite project bullets using impact logic
* Rewrite experience into stronger statements
* Reorder sections based on job relevance

The system may:

* Improve phrasing
* Strengthen impact language
* Add missing but user-supported detail
* Suggest relevant keywords

The system may not:

* Invent numbers
* Invent companies
* Invent tools
* Invent results
* Invent employment history

---

### 13. Suggested database schema

#### users

* id
* clerk_user_id
* name
* email
* created_at

#### profiles

* id
* user_id
* phone
* city
* degree
* university
* skills
* experience_text
* projects_text
* resume_file_url
* created_at
* updated_at

#### job_inputs

* id
* user_id
* job_title
* company_name
* job_description
* created_at

#### generated_resumes

* id
* user_id
* job_input_id
* match_score
* missing_keywords
* output_pdf_url
* output_tex_url
* created_at

#### applications

* id
* user_id
* company_name
* role_title
* status
* applied_date
* notes
* created_at
* updated_at

---

### 14. Pages to build

#### Landing page

Purpose:

* explain what Applytics does
* show value proposition
* send user to app

#### Auth pages

Purpose:

* sign up
* log in

#### Dashboard

Purpose:

* show recent resumes
* show tracker
* show stats

#### Profile setup page

Purpose:

* collect master data

#### Resume generator page

Purpose:

* paste job description
* generate tailored resume

#### Generated resume preview page

Purpose:

* view and download result

#### Tracker page

Purpose:

* manage application statuses

---

### 15. API endpoints

#### POST /api/profile

Create or update user profile

#### POST /api/upload-resume

Upload PDF resume and store file URL

#### POST /api/generate-resume

Main generation endpoint:

* input profile
* input resume text
* input job description
* output JSON resume structure
* compile LaTeX
* return PDF URL

#### POST /api/applications

Create new tracked application

#### PATCH /api/applications/:id

Update status or notes

#### DELETE /api/applications/:id

Remove entry

---

### 16. Acceptance criteria

The MVP is successful if all of the following work:

* User can sign up and log in
* User can create profile
* User can upload resume PDF
* User can paste a job description
* System generates tailored ATS-friendly resume
* System returns a match score
* System shows missing keywords
* User can download PDF
* User can save the job into tracker
* User can update application status

---

### 17. Milestones

#### Day 1

* Setup Next.js project
* Setup Supabase
* Setup Clerk
* Setup UI shell

#### Day 2

* Build profile form
* Build resume upload
* Build job description input

#### Day 3

* Build resume parsing logic
* Build Groq prompt pipeline
* Return structured JSON

#### Day 4

* Build LaTeX template
* Compile generated PDF

#### Day 5

* Build tracker dashboard
* Connect database

#### Day 6

* Polish UI
* Add error states
* Add loading states

#### Day 7

* Final testing
* Demo preparation
* Bug fixes

---

### 18. Major risks

* LLM may generate weak or verbose output
* LaTeX compilation may fail on malformed text
* Resume parsing may miss some formatting
* MVP may overfit CS students if testing is too narrow
* Users may expect job scraping even though it is not in MVP

Mitigation:

* keep one fixed template
* use schema-validated output
* sanitize LLM output before LaTeX insertion
* manually test with multiple resume styles
* clearly explain what MVP does and does not do

---

### 19. Why this MVP is the right one

This MVP is small enough to finish quickly and strong enough to demonstrate real value.

It proves the most important product hypothesis:

Can Applytics take a user’s profile and a job description and produce a better resume than the user would normally make on their own?

If the answer is yes, the startup has a real core.

---

### 20. Final build recommendation

For the MVP, the best implementation path is:

* Next.js App Router
* Server Components where useful
* Route handlers for API endpoints
* Tailwind for UI
* shadcn/ui for components
* Supabase for storage and persistence
* Clerk for auth
* Groq for schema-based generation
* Fixed LaTeX template for ATS-safe PDF output
* Vercel for deployment with GitHub integration