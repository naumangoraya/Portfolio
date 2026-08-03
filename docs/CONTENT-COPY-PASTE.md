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

| Field | Value |
|---|---|
| Greeting | `Hi, my name is` |
| Name | `Nauman Noor.` |
| Button label | `Check out my work!` |
| Email | `naumanjaat@gmail.com` |

**Tagline**
```
I ship `code`, teach it to `think`, then automate the rest.
```

**Intro paragraph**
```
I'm a software engineer based in Lahore, Pakistan, currently building full-stack apps, AI-powered systems, and automations at `Kcube AI`. Recently I've re-architected an AI recruitment platform for speed and accuracy, shipped a bilingual voice assistant for real-estate call handling, and automated internal operations for a financial-services client. I hold a BS in Computer Science from `FAST-NUCES`.
```

---

## About — `/admin/content/about` (one record)

**Heading**
```
About Me
```

**Description** (paste with the blank lines between paragraphs — they become line breaks on the page)
```
I'm a software engineer with about a year of industry experience building full-stack web applications, `AI-powered systems`, and low-code/no-code automations end to end.

I'm comfortable across the stack — `React` and the MERN ecosystem on the frontend and backend, `Python` with `FastAPI`, `Flask`, and `Django` on the server, and `SQL` and data pipelines underneath.

At `Kcube AI`, I've shipped a bilingual voice assistant that handles inbound real-estate calls, re-architected an AI recruitment platform from Django + Azure AI Search into a much faster React + FastAPI system, and automated internal operations on `n8n`, `Zapier`, and the `Microsoft Power Platform`.

On the AI/LLM side, I work with retrieval pipelines, document extraction, and `LangChain`/`LangGraph` chatbots. My BS in Computer Science from `FAST-NUCES` included a final-year project applying ETL pipelines and machine learning to e-commerce campaign analytics.

Here are a few technologies I've been working with recently:
```

**Skills** *(not editable here — already set)*: JavaScript · Python · React · Node.js / FastAPI · MongoDB / SQL · LangChain & LangGraph · n8n / Zapier / Make · Microsoft Power Platform

---

## Experience — `/admin/content/jobs` (2 records)

### Record 1

| Field | Value |
|---|---|
| Role | `Associate Full Stack Developer` |
| Company | `Kcube AI` |
| Location | `Lahore, Pakistan` |
| Date range | `August 2025 - Present` |
| Employment type | `Full-time` |
| Current role | `Yes` |
| Technologies | `React, FastAPI, Python, n8n, LangChain, LangGraph, Microsoft Power Platform, Vapi, Twilio` |

**Description**
```
Build and deliver full-stack web applications, AI-powered systems, and low-code/no-code automations end to end — working solo and in teams, owning features (sometimes entire products) from problem to production. Shipped a bilingual (English/Spanish) voice assistant for `Fausto Commercial` that answers real-estate inquiries and captures leads 24/7, re-architected an AI recruitment search from Django + Azure AI Search into a custom `React` + `FastAPI` pipeline with SQL-backed retrieval and windowed LLM processing, and built internal automation suites on `n8n`, `Zapier`, and the `Microsoft Power Platform` for clients including a financial-advisory firm and a photography agency.
```

### Record 2

| Field | Value |
|---|---|
| Role | `Data Science Trainee` |
| Company | `Programmers Force` |
| Location | `Lahore, Pakistan` |
| Date range | `August 2024 - September 2024` |
| Employment type | `Internship` |
| Current role | `No` |
| Technologies | `Python, OpenCV, Selenium, BeautifulSoup, Pandas, NumPy` |

**Description**
```
Hands-on traineeship in data science and computer vision. Trained and used models to extract information from images — locating coordinates, re-aligning, and pulling fields from ID cards and other documents — and built automated web-scraping workflows with `Selenium` and `BeautifulSoup`. Used LLMs to extract and process information from unstructured text, applying `Pandas`, `NumPy`, `Seaborn`, and `Matplotlib` for analysis and visualization.
```

---

## Education — `/admin/content/education` (6 records)

### Record 1 — Degree

| Field | Value |
|---|---|
| Degree | `BS Computer Science` |
| School | `FAST National University of Computer and Emerging Sciences (FAST-NUCES)` |
| Location | `Lahore, Pakistan` |
| Year | `2021 - 2025` |
| Type | `Degree` |
| Status | `Completed` |
| GPA | `2.76/4.00 (best semester: 3.50)` |

**Description**
```
Completed 130/130 credits with a strong upward trajectory — semester GPA rose from 1.82 to 3.50 across the final year. Final Year Project: `Advanced Clickstream Data Analytics for Enhanced Campaign Performance` — an end-to-end platform spanning ETL pipelines, ML forecasting, sentiment analysis, and Power BI dashboards. Relevant coursework: Artificial Intelligence, Natural Language Processing, Computer Vision, Database Systems, Software Engineering.
```

### Record 2 — Certificate
| Field | Value |
|---|---|
| Degree | `Oracle Cloud Infrastructure 2025 Certified Foundations Associate` |
| School | `Oracle` |
| Year | `Oct 2025` |
| Type | `Certificate` |
| Status | `Completed` |

### Record 3 — Certificate
| Field | Value |
|---|---|
| Degree | `Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate` |
| School | `Oracle` |
| Year | `Oct 2025` |
| Type | `Certificate` |
| Status | `Completed` |

### Record 4 — Certificate
| Field | Value |
|---|---|
| Degree | `Artificial Intelligence (ML, DL)` |
| School | `National Vocational and Technical Training Commission` |
| Year | `Sep 2024` |
| Type | `Certificate` |
| Status | `Completed` |

### Record 5 — Certificate
| Field | Value |
|---|---|
| Degree | `Meta Front-End Developer (Specialization)` |
| School | `Meta (Coursera)` |
| Year | `Nov 2023` |
| Type | `Certificate` |
| Status | `Completed` |

### Record 6 — Certificate
| Field | Value |
|---|---|
| Degree | `Introduction to Python` |
| School | `DataCamp` |
| Year | `Jul 2023` |
| Type | `Certificate` |
| Status | `Completed` |

---

## Projects — `/admin/content/projects` (6 records)

### Record 1
| Field | Value |
|---|---|
| Project | `SP-Talent Finder — AI Recruitment Platform` |
| Company | `Stellen-Profis` |
| Category | `Web App` |
| Status | `Completed` |
| Tech stack | `React, FastAPI, Azure OpenAI, LangGraph, SQL, ETL` |
| Featured | `Yes` |
| In project grid | `Yes` |

**Short description**
```
Re-architected a slow, expensive, low-accuracy candidate-search platform for a Swiss recruitment firm — replacing Django + Azure AI Search with a custom `React` + `FastAPI` pipeline: a purpose-built ETL layer, SQL-backed retrieval, a custom ranking algorithm, and windowed LLM processing so the model only ever sees candidates that fit its context window. Self-reported: cut per-query cost from roughly $30-35 to under $1, and raised relevant results surfaced from ~4-5 to the dozens.
```

### Record 2
| Field | Value |
|---|---|
| Project | `AVP Automation — Bilingual Voice Assistant` |
| Company | `Fausto Commercial` |
| Category | `Other` |
| Status | `Completed` |
| Tech stack | `Vapi, n8n, Airtable, Deepgram, Twilio, Gmail API` |
| Featured | `Yes` |
| In project grid | `Yes` |

**Short description**
```
Built a bilingual (English/Spanish) inbound voice-assistant system for a Miami commercial real-estate brokerage — automatic language routing, listing/agent lookup, lead capture into `Airtable`, and automated follow-up emails. Runs 24/7 and, self-reported, replaces the call-handling workload of roughly 5-6 reception/coordination staff.
```

### Record 3
| Field | Value |
|---|---|
| Project | `Advanced Clickstream Data Analytics` |
| Company | *(blank — academic project)* |
| Category | `Web App` |
| Status | `Completed` |
| Tech stack | `Python, ETL, Power BI, XGBoost, Prophet, SQL` |
| Featured | `Yes` |
| In project grid | `Yes` |

**Short description**
```
Final-year project consolidating sales, campaign, and customer-feedback data from multiple e-commerce platforms into one analytics platform — `ETL` pipelines feeding a star-schema data warehouse, machine learning models (Random Forest, XGBoost, Prophet, LSTM) for sales forecasting, sentiment analysis on reviews, and interactive `Power BI` dashboards with a chatbot for insights.
```

### Record 4
| Field | Value |
|---|---|
| Project | `49 Financial — Power Platform Automation Suite` |
| Company | `49 Financial` |
| Category | `Other` |
| Status | `Completed` |
| Tech stack | `Power Apps, Power Automate, SharePoint, Power BI` |
| Featured | `No` |
| In project grid | `Yes` |

**Short description**
```
Built a three-app internal operations suite (~25 screens) for a financial-advisory firm entirely on the `Microsoft Power Platform` — a `SharePoint`-backed contract-management registry with COO approval routing and renewal reminders, a multi-department ticketing hub with SLA countdowns, and a compliance-suitability dashboard replacing a manual Excel workbook with scheduled data pulls and a full audit trail.
```

### Record 5
| Field | Value |
|---|---|
| Project | `BKP Automation — Lead-to-Task Pipeline` |
| Company | *(blank — photography agency, unnamed)* |
| Category | `Other` |
| Status | `Completed` |
| Tech stack | `Zapier, Trello, n8n, Google Apps Script` |
| Featured | `No` |
| In project grid | `Yes` |

**Short description**
```
Automated the lead-to-task pipeline for a photography agency — new leads in `Sprout` trigger a `Zapier` workflow that creates a `Trello` card, Trello Butler generates checklists and assigns staff, the board syncs to `Google Sheets`, and Apps Script applies conditional logic, with `n8n` handling orchestration.
```

### Record 6
| Field | Value |
|---|---|
| Project | `AI Auto Interviewer — Eligibility Screening Platform` |
| Company | *(blank)* |
| Category | `Web App` |
| Status | `Completed` |
| Tech stack | `FastAPI, React, PostgreSQL, InsightFace, OpenAI Whisper` |
| Featured | `No` |
| In project grid | `Yes` |

**Short description**
```
Joined an existing `FastAPI` + `React` platform for AI-driven multi-language interviews, face verification, and eligibility screening for government funding programs. Focused on debugging and stabilizing existing features — AI interviews, face verification, and the admin panel — rather than building from scratch.
```

---

## Contact — `/admin/content/contact` (one record)

| Field | Value |
|---|---|
| Heading | `Get In Touch` |
| Email | `naumanjaat@gmail.com` |
| Phone | `+92 310 6623823` |

**Description**
```
I'm currently open to full-time roles in software engineering, AI/ML, and backend/full-stack systems — feel free to reach out.
```

**Social links** *(not editable here — already set)*: GitHub `github.com/naumangoraya` · LinkedIn `linkedin.com/in/nauman-noor-goraya` · Twitter `twitter.com/Naumangoraya1`
