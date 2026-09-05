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

# 🎯 Project Objective

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

# 🏗️ Workflow Architecture

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
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │ Telegram Alerts  │
                 │    (Planned)     │
                 └──────────────────┘
