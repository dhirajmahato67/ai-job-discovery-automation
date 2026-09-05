# 🤖 AI-Powered Job Discovery & Matching System

An AI-powered job discovery and matching workflow built with **n8n, Apify, Google Gemini, JavaScript, and Google Sheets**.

The project was created to solve a problem I personally face during my job search: **spending several hours every day searching through LinkedIn posts to find a small number of relevant Data/Analytics opportunities.**

Instead of manually checking hundreds of posts, this system automates the discovery, filtering, and initial evaluation process so I can spend more time actually applying and preparing for interviews.

---

## 📌 Why I Built This

While searching for Data Analyst opportunities, I noticed that finding jobs wasn't necessarily the hardest part.

The difficult part was finding the **right** jobs.

Every day, I had to manually search through LinkedIn posts and check:

- Is this actually a Data/Analytics role?
- Is the job available in India?
- Is it suitable for a fresher or someone with 1–2 years of experience?
- Was the post actually made by HR, a recruiter, or Talent Acquisition?
- Does the role match my technical skills?
- Is there a legitimate way to apply?
- Is the post still recent?

This process was taking around **3–4 hours a day**.

So I decided to build an automation around the problem instead of continuing to do the same manual work every day.

---

## 🎯 Project Objective

The goal of this project is to automatically discover and prioritize relevant **LinkedIn feed posts** for entry-level Data/Analytics opportunities.

The system focuses on:

- Recent hiring posts
- HR / Recruiter / Talent Acquisition posts
- Data and Analytics-related roles
- Opportunities in India
- Fresher and entry-level positions
- Roles requiring up to around 2 years of experience
- Skill compatibility with my profile
- Legitimate application methods

The system **does not automatically apply for jobs**.

The final decision to apply is still made manually by me.

---

## 🏗️ Workflow Architecture

```text
                 ┌──────────────────┐
                 │  Schedule Trigger │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │      Apify       │
                 │ LinkedIn Post    │
                 │    Discovery     │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │  Deduplication   │
                 │    JavaScript    │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │  Initial Filter  │
                 │ HR + Role +      │
                 │ Hiring Intent    │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │  Loop Over Items │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │   Google Gemini  │
                 │  AI Job Matching │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │ Structured Output│
                 │      Parser      │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │   Match Score    │
                 │      0–100       │
                 └────────┬─────────┘
                          │
                          ▼
                    ┌───────────┐
                    │ IF Score  │
                    │   >= 70   │
                    └─────┬─────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │   Google Sheets  │
                 │   Shortlisted    │
                 │   Opportunities  │
                 └──────────────────┘
```

---

## 🔄 How It Works

### 1. Schedule Trigger

The workflow starts automatically using the n8n Schedule Trigger.

Instead of manually starting the workflow every time, it can run on a scheduled basis and search for new opportunities.

### 2. LinkedIn Post Discovery

Apify is used to discover recent publicly accessible LinkedIn feed posts.

The search focuses on keywords related to roles such as:

- Data Analyst
- Junior Data Analyst
- Business Analyst
- Power BI Analyst
- Power BI Developer
- BI Analyst
- MIS Analyst
- MIS Executive
- Reporting Analyst
- Data Analytics
- Analytics Engineer

The system also prioritizes recent posts, with the main target being posts from the last 24 hours.

> **Important:** This project is focused on LinkedIn feed posts, not LinkedIn Jobs listings.
>
> For example, `https://www.linkedin.com/posts/...` is the type of post the system is designed to process.

### 🧹 3. Deduplication

LinkedIn searches can return the same post through multiple search queries.

For example, one post might match "Data Analyst" and also "Power BI". If both searches return the same post, it should only be processed once.

A JavaScript node removes duplicates using the LinkedIn post URL.

**Simplified logic:**

```javascript
const items = $input.all();

const seen = new Set();
const output = [];

for (const item of items) {
  const data = item.json;

  const url = data.linkedinUrl || '';

  if (!url) continue;
  if (seen.has(url)) continue;

  seen.add(url);

  output.push({
    json: {
      postUrl: url,
      postId: data.id || '',
      content: data.content || '',
      authorName: data.author?.name || '',
      authorHeadline: data.author?.info || '',
      authorUrl: data.author?.linkedinUrl || '',
      company: data.company?.name || '',
      postedAt: data.postedAt || '',
      reactions: data.reactions?.likes || 0,
      comments: data.comments?.count || 0
    }
  });
}

return output;
```

### 👤 4. HR / Recruiter Filtering

One of the main goals of the project is to prioritize posts from people involved in hiring.

The system looks for author titles such as:

- HR
- HR Manager
- HR Recruiter
- Recruiter
- Technical Recruiter
- IT Recruiter
- Talent Acquisition
- Talent Acquisition Specialist
- Talent Acquisition Partner
- Talent Acquisition Manager
- Recruitment Specialist
- Recruitment Manager
- Human Resources
- Hiring Manager

This helps reduce irrelevant posts from ordinary job seekers, career pages, and unrelated employees.

**Why this matters:** A large number of LinkedIn posts may mention a job without actually being useful hiring opportunities. For this project, I prefer fewer high-quality opportunities over a large number of irrelevant posts.

### 📊 5. Role Filtering

The system focuses on roles that align with my career goals.

**High-priority roles:**

- Data Analyst
- Junior Data Analyst
- Associate Data Analyst
- Data Analytics Analyst
- Analytics Analyst
- BI Analyst
- Business Intelligence Analyst
- Power BI Analyst
- Power BI Developer
- Reporting Analyst
- Data Reporting Analyst
- MIS Analyst
- MIS Executive
- Data & Business Analyst
- Junior Business Analyst
- Associate Business Analyst
- Business Analyst
- Product Analyst
- Operations Analyst

Analytics Engineer can also be considered, but it is a lower priority compared with Data Analyst and BI roles.

### 🎓 6. Experience Filtering

The system is designed around my current career stage.

My experience priority is:

| Experience | Priority |
|---|---|
| Fresher / 0–1 year | 🟢 Highest |
| 1–2 years | 🟢 High |
| 2–3 years | 🟡 Low |
| More than 3 years | 🔴 Reject |
| Senior / Lead / Manager | 🔴 Reject |

For example:

- "Data Analyst – Freshers Welcome" → High priority
- "Data Analyst – 1–2 years" → High priority
- "Data Analyst – 2–3 years" → Lower priority
- "Senior Data Analyst – 5+ years" → Reject

### 📍 7. Location Filtering

The primary target is India.

Examples of relevant locations include:

- Bengaluru
- Hyderabad
- Chennai
- Pune
- Mumbai
- Delhi NCR
- Gurugram
- Noida
- Lucknow
- Ahmedabad
- Kolkata
- Other locations in India

Remote roles are considered when the post explicitly allows candidates working from India.

Foreign-only positions are not relevant to the current job search.

### 🧠 8. AI-Based Job Matching

After the initial filtering, the remaining posts are sent to Google Gemini.

The purpose of using an LLM is not simply to find keywords. It evaluates whether the opportunity actually makes sense for my profile.

The AI checks:

- **Role Match** – Does the job match my target roles?
- **Experience Match** – Does the experience requirement fit my current level?
- **Skill Match** – How well do the required skills match my existing skills?
- **Location** – Is the opportunity available in India?
- **Education** – Does the education requirement align with my background?
- **Certification Relevance** – Are certifications such as Microsoft Power BI Data Analyst Associate relevant to the role?
- **Application Method** – Does the post provide a legitimate way to apply?
- **Authenticity** – Does the post appear to represent a genuine hiring opportunity?

### 👨‍💻 My Technical Profile

The AI evaluates opportunities against my actual skills.

**BI & Visualization**
Power BI, DAX, Data Modeling, Dashboard Development, KPI Reporting, Data Analytics

**Data & Analysis**
SQL, Python, Excel, Data Cleaning, Exploratory Data Analysis, Statistical Analysis, Business Analysis

**Microsoft Fabric**
Lakehouse, Warehouse, OneLake, Data Pipelines, PySpark, Medallion Architecture

**Data Engineering**
ETL/ELT, Data Transformation, Data Integration, Data Warehousing, Batch Processing

**Cloud & Databases**
Microsoft Azure, Azure SQL, AWS, Amazon S3, AWS Glue, AWS Lambda, AWS Athena, Snowflake, MySQL

**Programming**
Python, Pandas, NumPy, Matplotlib, PySpark, SQL

**Certification**
Microsoft Certified: Power BI Data Analyst Associate (PL-300)

### 📈 9. Match Scoring

Each opportunity receives a score from 0 to 100.

The scoring considers:

| Category | Weight |
|---|---|
| Role Match | 25 |
| Experience Match | 25 |
| Skills Match | 20 |
| Author Credibility | 15 |
| Application Legitimacy | 10 |
| Location | 5 |
| **Total** | **100** |

**Recommendation levels:**

- 90–100 → APPLY ASAP
- 80–89 → APPLY
- 70–79 → CONSIDER / APPLY
- < 70 → DO NOT PRIORITIZE

Experience is treated as an important constraint. A job requiring significantly more experience should not receive a high recommendation simply because the technical skills match.

### 🚫 10. Removing Low-Quality Opportunities

The system attempts to remove posts such as:

- Paid job groups
- Paid communities
- Job alert groups
- Paid mentorship
- Paid courses
- Bootcamps
- Training programs
- Resume-writing promotions
- Generic career advice
- Suspicious opportunities
- Posts asking applicants for money

The goal is to identify actual hiring opportunities rather than promotional content.

### 📩 11. Application Methods

The system recognizes several possible application methods.

**Strong signals**
- Company email
- Official company careers page
- Application form
- LinkedIn application
- lnkd.in application link

**Acceptable depending on context**
- Recruiter DM
- Google Form

A company email is useful but not mandatory. A missing email should not automatically cause a job to be rejected.

### 📊 12. Google Sheets

After AI evaluation, opportunities meeting the required score threshold are stored in Google Sheets.

Example fields include:

- Post URL
- Author
- Author Headline
- Company
- Posted At
- Match Score
- Hiring Intent
- Eligibility
- Recommendation
- Role Match
- Job Location
- Location Match
- Company Email
- Application Method
- Authenticity
- Skills Matched
- Missing Required Skills
- Experience Match
- Experience Concern
- Education Match
- Reason

This creates a searchable record of opportunities discovered by the automation, ready for manual review.

---

## 🔐 Important Design Decision

This project is **not** an auto-apply system.

I intentionally do not want the workflow to automatically submit job applications.

The workflow helps me with:

```
Discovery → Filtering → Evaluation → Prioritization
```

The final decision remains with me:

```
Review → Open LinkedIn → Check the job → Apply manually
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| n8n | Workflow automation |
| Apify | LinkedIn public post discovery |
| JavaScript | Cleaning, filtering and deduplication |
| Google Gemini | AI-based job evaluation |
| Structured Output Parser | Consistent AI output |
| Google Sheets | Store shortlisted jobs |

---

## 📂 Project Structure

```
ai-job-discovery-automation/
│
├── README.md
│
├── workflow/
│   └── n8n-job-discovery-workflow.json
│
├── prompts/
│   └── gemini-job-matching-prompt.txt
│
├── code/
│   ├── deduplication.js
│   └── job-filter.js
│
├── screenshots/
│   ├── workflow.png
│   ├── apify-output.png
│   ├── gemini-output.png
│   └── google-sheets-output.png
│
├── examples/
│   └── sample-output.json
│
└── .gitignore
```

---

## 🚀 Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/ai-job-discovery-automation.git
cd ai-job-discovery-automation
```

### 2. Import the n8n workflow

Open n8n and import:

```
workflow/n8n-job-discovery-workflow.json
```

### 3. Configure Apify

Create an Apify account and configure the LinkedIn post discovery Actor.

Add your Apify credentials inside n8n. Do not hard-code API credentials inside the workflow.

### 4. Configure Google Gemini

Add your Gemini credentials to n8n. The Gemini model is used for evaluating individual job opportunities.

### 5. Configure Google Sheets

Connect your Google account to n8n and select the spreadsheet where shortlisted opportunities should be stored.

---

## 🔒 Security

Never commit API keys, tokens, credentials, or session information to GitHub.

Before publishing the workflow, remove or replace:

- Apify API keys
- Gemini API keys
- Google credentials
- OAuth tokens
- Session cookies

Use environment variables or n8n credentials instead.

Example:

```
APIFY_API_TOKEN=your_token_here
GEMINI_API_KEY=your_key_here
```

Also add sensitive files to `.gitignore`.

---

## ⚠️ Limitations

This project is not perfect. Some limitations include:

- **Search quality** – LinkedIn search results may contain irrelevant posts even when specific keywords are used.
- **Author identification** – An author's LinkedIn headline does not always guarantee that they are responsible for the particular job being advertised.
- **Experience information** – Some posts do not clearly mention experience requirements. The AI should not assume that an unspecified experience requirement means "fresher."
- **Authenticity** – The system can identify suspicious signals, but AI cannot guarantee that every job post is legitimate.
- **Rate limits** – External APIs and LLM services can have rate limits, so the workflow uses controlled processing and waiting between requests where required.

---

## 🧪 Current Development Status

This project is currently under active development.

**Completed**
- [x] Scheduled workflow
- [x] LinkedIn feed post discovery
- [x] Post deduplication
- [x] Initial job filtering
- [x] HR/recruiter filtering
- [x] Data/Analytics role filtering
- [x] Gemini integration
- [x] Structured AI output
- [x] Experience matching
- [x] Skill matching
- [x] Location matching
- [x] Match scoring
- [x] Google Sheets integration

**In Progress**
- [ ] Improve recruiter/HR detection
- [ ] Improve search precision
- [ ] Reduce false positives
- [ ] Improve duplicate detection
- [ ] Improve authenticity scoring
- [ ] Job-search analytics dashboard
- [ ] Track applications and outcomes

---

## 📊 Expected Impact

The main goal isn't to collect thousands of job posts. The goal is to reduce the amount of time I spend searching.

**Before (manual, ≈3–4 hours/day):**

```
Manual LinkedIn search → Hundreds of posts → Open each post →
Check role → Check experience → Check location → Check skills →
Decide whether to apply
```

**With the automation:**

```
Automated discovery → Deduplication → HR + role filtering →
AI evaluation → Match score → Shortlist → Manual review & application
```

The objective is to spend less time searching and more time applying and preparing.

---

## 💡 What I Learned

One of the biggest lessons from this project is: **more data does not necessarily mean better results.**

Initially, I focused on finding as many posts as possible. But getting hundreds of posts isn't useful if most of them are irrelevant.

The better approach was to build a pipeline where each stage reduces noise:

```
Raw Data → Clean Data → Relevant Posts → HR/Recruiter Posts →
Target Roles → Suitable Experience → AI Matching → High-Quality Shortlist
```

This project has helped me get practical experience with:

- Workflow automation
- API integration
- Data extraction
- Data cleaning
- Deduplication
- JavaScript
- Rule-based filtering
- LLM integration
- Prompt engineering
- Structured outputs
- AI classification
- Scoring systems
- Rate-limit handling
- Designing systems around real-world problems

---

## 🔮 Future Improvements

Some ideas I want to explore next:

- Better HR/recruiter classification
- Multiple job-discovery sources
- Improved semantic skill matching
- Company quality scoring
- Duplicate detection using semantic similarity
- Application tracking — track which jobs I actually apply to
- Analyse application-to-interview conversion
- Build a dashboard showing job-search trends
- Learn from my previous application decisions
- Automatically adjust ranking based on my preferences

Eventually, I want to turn this into a more complete personal job intelligence system rather than just a job discovery workflow.

---

## 📸 Screenshots

> Add screenshots of the workflow and outputs here.

- n8n Workflow
- Apify Output
- AI Evaluation
- Google Sheets

---

## 🤝 Contributing

This is primarily a personal portfolio project, but suggestions and improvements are welcome.

If you have ideas for:

- Better job filtering
- AI matching
- n8n workflow design
- Data quality
- Automation
- Job-search analytics

feel free to open an issue or submit a pull request.

---

## 📜 Disclaimer

This project is intended for personal research, automation learning, and portfolio purposes.

It does not automatically submit job applications.

Users should review the terms and policies of the platforms and services they use and ensure their implementation complies with those terms.

---

## 👨‍💻 About

**Dhiraj Mahato**

Data Analyst | Power BI | SQL | Python | Microsoft Fabric | AI Automation

I'm interested in building practical solutions using data, analytics, automation, and AI.

This project started from a personal problem during my job search, and I'm continuing to improve it as I learn.

---

## ⭐ If you find this project interesting

Feel free to star the repository or share your thoughts.

I'm especially interested in ideas around: **AI + Automation + Data Analytics + Real-world Problems**
