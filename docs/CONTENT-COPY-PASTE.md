# Portfolio Content — Copy-Paste Reference

This is already live on the site (pushed directly to the database via a script).
This doc is the reference sheet of exactly what's in each field, organized by the
admin screen it lives on — use it if you want to review or tweak anything yourself
at `/admin/content/<resource>`. Field labels below match the admin form exactly.

**Not editable in the admin panel yet** (these were set via script and don't have a
form control on these screens — editing other fields on the same record won't touch
them): About → Skills, Contact → Social links, and every image field. If you want to
change any of these, tell me the new value and I'll run a quick script update.

---

## Hero — `/admin/content/hero` (one record)

| Field        | Value                  |
| ------------ | ---------------------- |
| Greeting     | `Hi, my name is`       |
| Name         | `Nauman Noor.`         |
| Button label | `Check out my work!`   |
| Email        | `naumanjaat@gmail.com` |

**Tagline**

```
I ship `code`, teach it to `think`, then automate the rest.
```

**Intro paragraph**

```
I'm a software engineer based in Lahore, Pakistan, building full-stack apps, AI-powered systems, and automations at `Kcube AI`.
```

---

## About — `/admin/content/about` (one record)

**Heading**

```
About Me
```

**Description** (paste with the blank lines between paragraphs — they become line breaks on the page)

```
I'm a software engineer with about a year of experience building full-stack web apps, `AI-powered systems`, and automations end to end — comfortable across `React`, `Python` (`FastAPI`, `Flask`, `Django`), and `SQL`.

At `Kcube AI`, I've shipped a bilingual voice assistant, re-architected an AI recruitment platform for speed, and automated internal operations on `n8n` and the `Microsoft Power Platform`. On the AI/LLM side, I work with retrieval pipelines and `LangChain`/`LangGraph`.

BS in Computer Science from `FAST-NUCES`.

Here are a few technologies I've been working with recently:
```

**Skills** _(not editable here — already set)_: JavaScript · Python · React · Node.js / FastAPI · MongoDB / SQL · LangChain & LangGraph · n8n / Zapier / Make · Microsoft Power Platform

---

## Experience — `/admin/content/jobs` (2 records)

### Record 1

| Field           | Value                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------- |
| Role            | `Associate Full Stack Developer`                                                            |
| Company         | `Kcube AI`                                                                                  |
| Location        | `Lahore, Pakistan`                                                                          |
| Date range      | `August 2025 - Present`                                                                     |
| Employment type | `Full-time`                                                                                 |
| Current role    | `Yes`                                                                                       |
| Technologies    | `React, FastAPI, Python, n8n, LangChain, LangGraph, Microsoft Power Platform, Vapi, Twilio` |

**Description**

```
Build full-stack web apps, AI-powered systems, and automations end to end — from problem to production, solo and in teams. Shipped a bilingual voice assistant for `Fausto Commercial`, re-architected an AI recruitment platform into a `React` + `FastAPI` pipeline, and built automation suites on `n8n` and the `Microsoft Power Platform` for a financial-advisory firm and a photography agency.
```

### Record 2

| Field           | Value                                                    |
| --------------- | -------------------------------------------------------- |
| Role            | `Data Science Trainee`                                   |
| Company         | `Programmers Force`                                      |
| Location        | `Lahore, Pakistan`                                       |
| Date range      | `August 2024 - September 2024`                           |
| Employment type | `Internship`                                             |
| Current role    | `No`                                                     |
| Technologies    | `Python, OpenCV, Selenium, BeautifulSoup, Pandas, NumPy` |

**Description**

```
Hands-on traineeship in data science and computer vision — trained models to extract fields from ID cards and documents, built web-scraping workflows with `Selenium` and `BeautifulSoup`, and used LLMs plus `Pandas`/`NumPy` for text extraction and analysis.
```

---

## Education — `/admin/content/education` (6 records)

### Record 1 — Degree

| Field    | Value                                                                     |
| -------- | ------------------------------------------------------------------------- |
| Degree   | `BS Computer Science`                                                     |
| School   | `FAST National University of Computer and Emerging Sciences (FAST-NUCES)` |
| Location | `Lahore, Pakistan`                                                        |
| Year     | `2021 - 2025`                                                             |
| Type     | `Degree`                                                                  |
| Status   | `Completed`                                                               |
| GPA      | `2.76/4.00 (best semester: 3.50)`                                         |

**Description**

```
Completed 130/130 credits, with semester GPA rising from 1.82 to 3.50 in the final year. Final Year Project: `Advanced Clickstream Data Analytics` — an ETL + ML forecasting + Power BI platform. Coursework: AI, NLP, Computer Vision, Database Systems.
```

### Record 2 — Certificate

| Field  | Value                                                              |
| ------ | ------------------------------------------------------------------ |
| Degree | `Oracle Cloud Infrastructure 2025 Certified Foundations Associate` |
| School | `Oracle`                                                           |
| Year   | `Oct 2025`                                                         |
| Type   | `Certificate`                                                      |
| Status | `Completed`                                                        |

### Record 3 — Certificate

| Field  | Value                                                                 |
| ------ | --------------------------------------------------------------------- |
| Degree | `Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate` |
| School | `Oracle`                                                              |
| Year   | `Oct 2025`                                                            |
| Type   | `Certificate`                                                         |
| Status | `Completed`                                                           |

### Record 4 — Certificate

| Field  | Value                                                   |
| ------ | ------------------------------------------------------- |
| Degree | `Artificial Intelligence (ML, DL)`                      |
| School | `National Vocational and Technical Training Commission` |
| Year   | `Sep 2024`                                              |
| Type   | `Certificate`                                           |
| Status | `Completed`                                             |

### Record 5 — Certificate

| Field  | Value                                       |
| ------ | ------------------------------------------- |
| Degree | `Meta Front-End Developer (Specialization)` |
| School | `Meta (Coursera)`                           |
| Year   | `Nov 2023`                                  |
| Type   | `Certificate`                               |
| Status | `Completed`                                 |

### Record 6 — Certificate

| Field  | Value                    |
| ------ | ------------------------ |
| Degree | `Introduction to Python` |
| School | `DataCamp`               |
| Year   | `Jul 2023`               |
| Type   | `Certificate`            |
| Status | `Completed`              |

---

## Projects — `/admin/content/projects` (6 records)

### Record 1

| Field           | Value                                               |
| --------------- | --------------------------------------------------- |
| Project         | `SP-Talent Finder — AI Recruitment Platform`        |
| Company         | `Stellen-Profis`                                    |
| Category        | `Web App`                                           |
| Status          | `Completed`                                         |
| Tech stack      | `React, FastAPI, Azure OpenAI, LangGraph, SQL, ETL` |
| Featured        | `Yes`                                               |
| In project grid | `Yes`                                               |

**Short description**

```
Re-architected a slow, expensive candidate-search platform for a Swiss recruitment firm — replaced Django + Azure AI Search with a custom `React` + `FastAPI` pipeline: ETL, SQL-backed retrieval, and windowed LLM processing. Self-reported: cut per-query cost from ~$30-35 to under $1, and raised relevant results from ~4-5 to dozens.
```

### Record 2

| Field           | Value                                              |
| --------------- | -------------------------------------------------- |
| Project         | `AVP Automation — Bilingual Voice Assistant`       |
| Company         | `Fausto Commercial`                                |
| Category        | `Other`                                            |
| Status          | `Completed`                                        |
| Tech stack      | `Vapi, n8n, Airtable, Deepgram, Twilio, Gmail API` |
| Featured        | `Yes`                                              |
| In project grid | `Yes`                                              |

**Short description**

```
Built a bilingual (English/Spanish) inbound voice assistant for a Miami real-estate brokerage — language routing, listing/agent lookup, lead capture into `Airtable`, and automated follow-ups. Runs 24/7; self-reported to replace ~5-6 reception staff's call-handling workload.
```

### Record 3

| Field           | Value                                          |
| --------------- | ---------------------------------------------- |
| Project         | `Advanced Clickstream Data Analytics`          |
| Company         | _(blank — academic project)_                   |
| Category        | `Web App`                                      |
| Status          | `Completed`                                    |
| Tech stack      | `Python, ETL, Power BI, XGBoost, Prophet, SQL` |
| Featured        | `Yes`                                          |
| In project grid | `Yes`                                          |

**Short description**

```
Final-year project consolidating e-commerce sales, campaign, and feedback data into one platform — `ETL` pipelines, ML forecasting (XGBoost, Prophet, LSTM), sentiment analysis, and `Power BI` dashboards with a chatbot for insights.
```

### Record 4

| Field           | Value                                              |
| --------------- | -------------------------------------------------- |
| Project         | `49 Financial — Power Platform Automation Suite`   |
| Company         | `49 Financial`                                     |
| Category        | `Other`                                            |
| Status          | `Completed`                                        |
| Tech stack      | `Power Apps, Power Automate, SharePoint, Power BI` |
| Featured        | `No`                                               |
| In project grid | `Yes`                                              |

**Short description**

```
Built a three-app internal operations suite (~25 screens) on the `Microsoft Power Platform` for a financial-advisory firm — a `SharePoint` contract registry with approval routing, a ticketing hub with SLA countdowns, and a compliance dashboard replacing a manual Excel workbook.
```

### Record 5

| Field           | Value                                     |
| --------------- | ----------------------------------------- |
| Project         | `BKP Automation — Lead-to-Task Pipeline`  |
| Company         | _(blank — photography agency, unnamed)_   |
| Category        | `Other`                                   |
| Status          | `Completed`                               |
| Tech stack      | `Zapier, Trello, n8n, Google Apps Script` |
| Featured        | `No`                                      |
| In project grid | `Yes`                                     |

**Short description**

```
Automated the lead-to-task pipeline for a photography agency — new leads trigger a `Zapier` workflow that creates a `Trello` card, auto-assigns staff, and syncs to `Google Sheets`, with `n8n` handling orchestration.
```

### Record 6

| Field           | Value                                                     |
| --------------- | --------------------------------------------------------- |
| Project         | `AI Auto Interviewer — Eligibility Screening Platform`    |
| Company         | _(blank)_                                                 |
| Category        | `Web App`                                                 |
| Status          | `Completed`                                               |
| Tech stack      | `FastAPI, React, PostgreSQL, InsightFace, OpenAI Whisper` |
| Featured        | `No`                                                      |
| In project grid | `Yes`                                                     |

**Short description**

```
Joined an existing `FastAPI` + `React` platform for AI-driven interviews and eligibility screening for government funding programs — focused on debugging and stabilizing existing features rather than building from scratch.
```

---

## Contact — `/admin/content/contact` (one record)

| Field   | Value                  |
| ------- | ---------------------- |
| Heading | `Get In Touch`         |
| Email   | `naumanjaat@gmail.com` |
| Phone   | `+92 310 6623823`      |

**Description**

```
I'm currently open to full-time roles in software engineering, AI/ML, and backend/full-stack systems — feel free to reach out.
```

**Social links** _(not editable here — already set)_: GitHub `github.com/naumangoraya` · LinkedIn `linkedin.com/in/nauman-noor-goraya` · Twitter `twitter.com/Naumangoraya1`
