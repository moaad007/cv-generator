# PRD — AI Job-Specific CV Builder

**Product name:** TBD
**Version:** 1.0 — MVP
**Status:** Product Definition
**Target:** Web application
**Primary market:** Job seekers
**Core concept:** AI-powered conversational CV builder that interviews the user based on a specific job description and generates a tailored, ATS-friendly CV.

---

## 1. Product Vision

Build an AI career assistant that doesn't ask users to fill out a long CV form.

Instead, the user provides a **job description**, and the AI conducts a short, intelligent interview to discover the user's relevant:

* Experience
* Projects
* Skills
* Education
* Achievements
* Responsibilities
* Technical knowledge
* Soft skills

The system then uses this information to generate a **job-specific CV**.

### Core principle

> **The AI should discover the candidate's real experience, not invent experience for them.**

---

# 2. Problem

Traditional CV builders require users to manually complete many fields:

```text
Personal Information
↓
Education
↓
Experience
↓
Skills
↓
Projects
↓
Achievements
↓
Summary
↓
Template
↓
CV
```

This creates several problems:

* Users don't know what information is important.
* Users don't know how to describe their experience.
* Users often create generic CVs.
* CVs aren't tailored to the job.
* Users may forget relevant projects or skills.
* Users often use weak descriptions.
* ATS optimization is poorly understood.
* Filling out forms is tedious.

---

# 3. Solution

The application reverses the process.

```text
Job Description
       ↓
AI analyzes job
       ↓
AI identifies requirements
       ↓
AI interviews candidate
       ↓
Structured candidate profile
       ↓
Job ↔ Candidate matching
       ↓
AI writes CV content
       ↓
User reviews
       ↓
CV template
       ↓
PDF
```

The primary interface is a **chat conversation**.

---

# 4. Target Users

## Primary User

Job seekers applying for:

* Junior positions
* Internships
* Graduate positions
* Mid-level positions
* Technical positions
* Non-technical positions

## Secondary Users

People who:

* Have an old CV
* Have little professional experience
* Have many projects but don't know how to present them
* Change careers
* Apply to multiple jobs
* Want different CVs for different jobs

---

# 5. Product Goals

### MVP goals

The MVP must allow a user to:

1. Create a CV session.
2. Paste a job description.
3. Analyze the job description.
4. Extract requirements.
5. Start an AI interview.
6. Answer questions through chat.
7. Build a structured candidate profile.
8. Match candidate information against the job.
9. Generate tailored CV content.
10. Preview the CV.
11. Edit the generated content.
12. Export the CV as PDF.

---

# 6. Non-Goals for MVP

Do **not** build these initially:

* Job marketplace
* Automatic job applications
* LinkedIn automation
* Email automation
* Employer dashboard
* Recruiter accounts
* Social networking
* Full career coaching platform
* Automatic skill verification
* Fake experience generation
* Complex analytics
* Mobile native application

These can come later.

---

# 7. Core User Flow

## Step 1 — Landing Page

User sees:

> **Build a CV for the job you actually want.**

Subtitle:

> Paste a job description. Our AI interviews you about your experience and creates a tailored CV.

CTA:

**Build My CV**

Secondary:

**See How It Works**

---

# 8. Step 2 — Job Description

User enters:

```text
Paste the job description here...

[ Job description ]

[ Start Interview ]
```

Optional:

```text
Job title
Company
Location
```

The user should not be forced to manually enter these.

The AI should attempt to extract them from the job description.

---

# 9. Job Analysis

The AI analyzes the description.

### Extract:

#### Job information

```text
Title
Company
Location
Employment type
Seniority
```

#### Technical requirements

Example:

```text
React
Node.js
PostgreSQL
REST APIs
Git
Docker
```

#### Experience requirements

```text
2+ years experience
Team collaboration
Agile
```

#### Soft skills

```text
Communication
Problem solving
Teamwork
```

#### Responsibilities

```text
Build web applications
Maintain APIs
Collaborate with developers
Fix bugs
```

#### Preferred qualifications

Separate:

```text
Required
Preferred
```

This distinction is important.

---

# 10. AI Interview

The AI becomes the user's interviewer.

Example:

> **AI**
>
> I've analyzed the position.
>
> The company is mainly looking for someone with React, Node.js, REST API and PostgreSQL experience.
>
> Let's start with your React experience.
>
> **Have you used React in a real project?**

User:

> Yes, I built an inventory management system.

AI:

> Great. What did you personally build in that system?

User:

> Authentication, product management and stock tracking.

AI:

> Was this a personal project, school project, freelance project, internship or professional project?

User:

> Personal project.

AI:

> What technologies did you use?

---

# 11. Interview Rules

The AI interviewer must follow strict rules.

## Rule 1 — Never invent experience

If the user says:

> I haven't used Docker.

The AI must **not** write:

> Experienced with Docker.

Instead:

> Docker is listed as a preferred skill. Since you haven't used it, I won't claim it as an experience.

---

## Rule 2 — Ask targeted questions

Questions should come from the job description.

Bad:

> Tell me about yourself.

Better:

> The position requires REST API development. Have you built or consumed REST APIs?

---

## Rule 3 — Don't repeat questions

The AI must maintain a state of what has already been established.

---

## Rule 4 — Keep the interview short

Target:

**5–15 questions**

depending on the candidate's profile.

The AI should stop when it has enough information.

---

## Rule 5 — Prioritize relevant information

If the job requires React but the user has 10 unrelated skills, focus on React first.

---

## Rule 6 — Ask follow-up questions when answers are weak

Example:

User:

> I built an app with React.

AI:

> What functionality did you implement?

Then:

> Did you work on the frontend only or also the backend?

Then:

> How was the data stored?

---

# 12. Candidate Profile

The conversation must populate a structured candidate profile.

```text
Candidate
│
├── Personal Information
│
├── Professional Summary
│
├── Experience
│
├── Projects
│
├── Education
│
├── Skills
│
├── Languages
│
├── Certifications
│
├── Achievements
│
└── Additional Information
```

The chat is the **input interface**.

The structured profile is the **source of truth**.

---

# 13. Candidate Profile Schema

Example:

```json
{
  "personal": {
    "name": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "github": ""
  },
  "summary": "",
  "experience": [],
  "projects": [],
  "education": [],
  "skills": [],
  "languages": [],
  "certifications": [],
  "achievements": []
}
```

---

# 14. Experience Object

```json
{
  "company": "",
  "role": "",
  "location": "",
  "startDate": "",
  "endDate": "",
  "employmentType": "",
  "responsibilities": [],
  "achievements": [],
  "technologies": []
}
```

---

# 15. Project Object

```json
{
  "name": "",
  "description": "",
  "type": "",
  "technologies": [],
  "features": [],
  "responsibilities": [],
  "achievements": [],
  "links": []
}
```

---

# 16. Job Requirements Object

The job description should also become structured data.

```json
{
  "title": "",
  "company": "",
  "seniority": "",
  "requiredSkills": [],
  "preferredSkills": [],
  "responsibilities": [],
  "softSkills": [],
  "experienceRequirements": []
}
```

---

# 17. Matching Engine

After the interview:

```text
Candidate Profile
        +
Job Requirements
        ↓
Matching Engine
```

Generate:

### Strong Matches

```text
✓ React
✓ JavaScript
✓ REST APIs
✓ Git
```

### Partial Matches

```text
⚠ PostgreSQL
⚠ Docker
```

### Missing

```text
✕ AWS
```

The system must distinguish between:

**Missing evidence**

and

**Candidate doesn't have the skill.**

Those are not the same.

---

# 18. Match Score

Example:

```text
JOB MATCH

78%
```

Breakdown:

```text
Technical skills     85%
Experience            70%
Education             100%
Soft skills           80%
```

The score should be treated as an **internal guidance metric**, not a factual probability of getting hired.

Avoid claims such as:

> "You have a 78% chance of getting hired."

---

# 19. CV Generation

After the interview:

> **Your CV is ready.**

The AI generates:

### Professional Summary

Specific to the job.

### Experience

Prioritize relevant experience.

### Projects

Prioritize projects relevant to the position.

### Skills

Prioritize job-relevant skills.

### Education

Keep factual.

---

# 20. CV Optimization Rules

The AI should:

### DO

* Use concise language.
* Use action verbs.
* Highlight measurable achievements when provided.
* Prioritize job-relevant experience.
* Use terminology from the job description when truthful.
* Make descriptions ATS-readable.
* Keep formatting simple.
* Maintain factual accuracy.

### DON'T

* Invent achievements.
* Invent numbers.
* Invent employment.
* Invent technologies.
* Claim proficiency the user doesn't have.
* Copy the job description verbatim.
* Stuff keywords unnaturally.

---

# 21. ATS Optimization

The CV should be optimized for parsing.

Avoid:

* Excessive graphics
* Complex tables
* Text embedded in images
* Multiple-column layouts for the default template
* Decorative icons replacing text
* Unusual fonts

Use:

```text
Name
Contact
Summary
Experience
Projects
Skills
Education
Languages
```

---

# 22. CV Templates

MVP should start with **3 templates**.

### Template 1 — ATS Classic

Minimal.

Best default.

### Template 2 — Modern

Slightly more visual.

### Template 3 — Technical

Designed for developers/technical candidates.

The content must remain independent of the template.

```text
Candidate Data
      ↓
CV Content
      ↓
Template
```

---

# 23. Live CV Preview

The application should display:

```text
┌───────────────────────────────┐
│       CV PREVIEW              │
│                               │
│ Moaad Lbahi                   │
│ Junior Full-Stack Developer   │
│                               │
│ SUMMARY                       │
│ ...                           │
│                               │
│ EXPERIENCE                    │
│ ...                           │
│                               │
│ PROJECTS                      │
│ ...                           │
└───────────────────────────────┘
```

The preview updates whenever the user changes the CV.

---

# 24. Editing

The AI should never have complete control over the final document.

User can click:

**Edit**

and manually modify:

* Name
* Summary
* Experience
* Projects
* Skills
* Education
* Languages

The user always owns the final content.

---

# 25. AI Rewrite Actions

For every CV section:

```text
Improve
Shorten
Make more professional
Make more technical
Add measurable impact
```

However, **"Add measurable impact" must only use numbers provided by the user.**

The AI must not manufacture metrics.

---

# 26. Chat Commands

The user should be able to say:

> "Make this shorter."

> "I forgot another project."

> "Remove Python."

> "Add my internship."

> "Change my title to Junior Backend Developer."

The AI updates the structured candidate profile.

---

# 27. Existing CV Import

Phase 2.

User uploads:

```text
PDF
DOCX
```

System extracts:

```text
Experience
Skills
Projects
Education
Languages
```

Then AI says:

> I imported your existing CV. I found 2 projects and 1 work experience. I'll ask a few questions to improve the information relevant to this job.

This dramatically reduces onboarding time.

---

# 28. Job Description Input Methods

MVP:

**Paste text**

Phase 2:

**Upload PDF/DOCX**

Phase 3:

**Job URL**

Phase 4:

Browser extension.

---

# 29. User Accounts

MVP can support:

```text
Google Login
Email/password
```

User dashboard:

```text
My CVs

Frontend Developer — Google
Last edited: Today

Backend Developer — Company X
Last edited: Aug 10

Software Engineer — Company Y
Last edited: Aug 2
```

---

# 30. CV Versioning

Each job should create a separate version.

Example:

```text
Moaad CV
│
├── Frontend Developer — Company A
├── Full-Stack Developer — Company B
└── Backend Developer — Company C
```

The original candidate profile remains unchanged.

---

# 31. Important Data Model

Suggested entities:

```text
User
CandidateProfile
Job
JobRequirement
Conversation
Message
Experience
Project
Education
Skill
Language
CV
CVVersion
CVTemplate
```

Relationship:

```text
User
 │
 └── CandidateProfile
       │
       ├── Experience
       ├── Projects
       ├── Education
       └── Skills

User
 │
 └── Jobs
       │
       └── Conversations
              │
              └── CVVersion
```

---

# 32. Recommended Tech Stack

Based on your existing development experience, I'd use:

### Frontend

**Next.js**

* JavaScript
* Tailwind CSS
* shadcn/ui
* React

### Backend

**Node.js + Express**

### Database

**PostgreSQL**

### ORM

**Prisma**

### AI

LLM API with structured JSON output/function calling.

### Authentication

Auth.js or a simple JWT/session solution.

### PDF

HTML/CSS → PDF renderer.

### Storage

S3-compatible object storage if needed.

### Deployment

```text
Frontend → Vercel
Backend → DigitalOcean
Database → Managed PostgreSQL
```

---

# 33. AI Architecture

Do **not** have one giant prompt handling everything.

Separate AI responsibilities.

```text
             ┌──────────────────┐
             │ Job Description  │
             └────────┬─────────┘
                      ↓
              Job Analyzer AI
                      ↓
              Job Requirements
                      │
                      ↓
┌──────────── Candidate Interview ────────────┐
│                                             │
│                 Interview AI                │
│                     ↓                       │
│              Candidate Facts                │
└─────────────────────┬───────────────────────┘
                      ↓
              Matching Engine
                      ↓
               CV Writer AI
                      ↓
              Structured CV
                      ↓
                 Renderer
                      ↓
                    PDF
```

This makes debugging much easier.

---

# 34. AI Prompt Rules

Every AI agent must follow these global rules:

### Truthfulness

> Never invent candidate information.

### Evidence

> Only claim a skill when supported by user-provided information.

### Relevance

> Prioritize information relevant to the target job.

### Conciseness

> Avoid unnecessary questions.

### Consistency

> Never contradict previously confirmed candidate information.

### User Control

> Never silently delete or alter important candidate information.

---

# 35. Conversation State

Every message should be associated with:

```text
conversation_id
user_id
role
content
timestamp
```

Roles:

```text
system
assistant
user
```

The backend should also maintain:

```text
currentInterviewStage
questionsAsked
topicsCovered
missingInformation
candidateFacts
```

---

# 36. Interview State Machine

```text
START
  ↓
JOB_ANALYSIS
  ↓
PERSONAL_INFO
  ↓
EXPERIENCE
  ↓
PROJECTS
  ↓
SKILLS
  ↓
EDUCATION
  ↓
GAPS
  ↓
REVIEW
  ↓
CV_GENERATION
  ↓
COMPLETE
```

The AI can skip stages when sufficient information already exists.

---

# 37. UX Rules

The interface should feel like **ChatGPT + Canva**, not a traditional CV form.

### Principles

* One question at a time.
* Minimal forms.
* Clear progress.
* Immediate feedback.
* Always show what the AI knows.
* Easy correction.
* No unnecessary configuration.

---

# 38. Progress Indicator

Example:

```text
CV BUILDING

████████████░░░░ 75%

✓ Job analyzed
✓ Experience
✓ Projects
✓ Skills
○ Final review
```

Don't show fake precision such as:

> "Your CV is 73.4% complete."

Use meaningful stages.

---

# 39. Safety / Trust

This is extremely important because CVs contain personal information.

The application must:

* Protect user data.
* Encrypt sensitive data where appropriate.
* Use HTTPS.
* Never expose CVs publicly by default.
* Allow users to delete their data.
* Avoid storing AI prompts unnecessarily.
* Clearly explain AI usage.
* Never fabricate credentials.

---

# 40. Privacy

User should be able to:

**Delete account**

and:

> Delete all CVs and candidate data.

The application should provide a clear privacy policy before launch.

---

# 41. Error Handling

### AI unavailable

```text
We're having trouble connecting to the AI.
Your progress has been saved.
Try again.
```

### PDF generation failure

```text
We couldn't generate your PDF.
Your CV content is safe.
Try generating it again.
```

### Invalid job description

```text
This doesn't appear to contain enough information about a job.

Please paste the full job description.
```

---

# 42. MVP Screens

Build only these initially:

### 1. Landing

```text
Hero
How it works
CTA
```

### 2. Create CV

```text
Job description
Start
```

### 3. AI Interview

```text
Chat
Candidate progress
CV summary
```

### 4. CV Editor

```text
Sections
Editable content
AI actions
```

### 5. CV Preview

```text
Live preview
Template selector
Download PDF
```

### 6. Dashboard

```text
CVs
Create new CV
Delete
Duplicate
```

---

# 43. MVP User Journey

```text
Landing
   ↓
Paste Job
   ↓
Analyze
   ↓
AI Interview
   ↓
Review Information
   ↓
Generate CV
   ↓
Edit
   ↓
Choose Template
   ↓
Preview
   ↓
Download PDF
```

Target:

**First CV generated in <10 minutes.**

---

# 44. Analytics

Track:

```text
Landing → Create CV
Create CV → Job submitted
Job submitted → Interview started
Interview → CV generated
CV generated → PDF downloaded
```

Important metrics:

### Activation

% of users who generate their first CV.

### Completion

% who finish the AI interview.

### Download rate

% who download a CV.

### Time to CV

Average time from job submission → PDF.

### Retention

Users creating another job-specific CV.

---

# 45. Success Criteria

MVP is successful if:

* Users understand the product without explanation.
* Users can provide a job description easily.
* AI asks relevant questions.
* AI doesn't fabricate candidate information.
* CV content is materially tailored to the job.
* User can correct AI output.
* PDF looks professional.
* CV is ATS-friendly.
* User can generate a CV in under 10 minutes.

---

# 46. Future Roadmap

## V1.1

* More templates
* DOCX export
* Existing CV upload
* Better editing
* Cover letters

## V1.2

* Job URL import
* Job tracking
* Multiple CV versions
* Match explanations

## V2

**AI Interview Coach**

After CV generation:

> "Would you like to practice the interview for this job?"

AI asks interview questions based on:

```text
Job Description
+
Candidate CV
```

---

# 47. V3 — AI Career Agent

The product evolves from:

**CV Generator**

into:

**AI Career Agent**

```text
                  AI CAREER AGENT
                         │
       ┌─────────────────┼─────────────────┐
       ↓                 ↓                 ↓
   CV Builder       Job Matcher       Interview Coach
       │                 │                 │
       ↓                 ↓                 ↓
 Cover Letter       Job Tracker       Skill Gaps
```

Eventually:

```text
Find job
   ↓
Analyze job
   ↓
Tailor CV
   ↓
Generate cover letter
   ↓
Prepare interview
   ↓
Track application
   ↓
Analyze result
```

---

# 48. Product Differentiator

The product should **not** be marketed as:

> "AI CV Generator"

There are too many of those.

The positioning should be closer to:

> **"An AI that interviews you and builds your CV for the job."**

That's the interesting part.

The product's core loop becomes:

**Job → Interview → Understand candidate → Match → CV**

rather than:

**Form → AI → CV**

---

# 49. Development Priorities

Build in this exact order:

### Phase 1 — Foundation

* [ ] Next.js application
* [ ] Express API
* [ ] PostgreSQL
* [ ] Prisma
* [ ] Basic UI
* [ ] Authentication

### Phase 2 — Job Analysis

* [ ] Job description input
* [ ] Job extraction
* [ ] Requirements extraction
* [ ] Structured job object

### Phase 3 — AI Interview

* [ ] Chat interface
* [ ] Conversation persistence
* [ ] Interview state
* [ ] Dynamic questions
* [ ] Follow-up questions
* [ ] Candidate fact extraction

### Phase 4 — Candidate Profile

* [ ] Experience model
* [ ] Project model
* [ ] Education model
* [ ] Skills model
* [ ] Languages
* [ ] Profile editor

### Phase 5 — CV Engine

* [ ] CV content generation
* [ ] Job matching
* [ ] ATS optimization
* [ ] CV editor
* [ ] Templates

### Phase 6 — PDF

* [ ] HTML CV
* [ ] PDF rendering
* [ ] Download
* [ ] Print-friendly output

### Phase 7 — Polish

* [ ] Loading states
* [ ] Error handling
* [ ] Mobile responsive design
* [ ] Analytics
* [ ] Privacy controls

---

# 50. The Most Important Technical Rule

**Keep candidate data separate from generated CV content.**

For example:

```text
Candidate says:

"I built an inventory app with Next.js."

                ↓

Candidate Fact
{
  project: "Inventory App",
  technology: "Next.js"
}

                ↓

CV Generator

"Developed an inventory management application
using Next.js..."
```

If the user later changes the CV template, target job, or wording, you can regenerate the CV without having to interview them again.

This architecture will also let you eventually create **multiple tailored CVs from the same candidate profile**.

---

## Final MVP Definition

If we strip everything down, the product is:

> **A conversational AI application where a user pastes a job description, the AI interviews them about their real experience, builds a structured candidate profile, identifies relevant experience and skills, generates a tailored ATS-friendly CV, and lets the user edit and export it as a professional PDF.**

That's the product I'd build first.

And for **your stack specifically**, I would keep the MVP at **Next.js + JavaScript + Tailwind/shadcn → Express + Prisma → PostgreSQL → LLM API → HTML/CSS PDF generation** rather than introducing unnecessary technologies.
