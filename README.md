# ⬡ AI Scout — Talent Intelligence Platform

> AI-powered candidate screening, scoring, and shortlisting dashboard built with React + Flask.

---

## 🚀 Live Demo

> Deploy locally using the instructions below. A deployed URL can be added after hosting on Render/Vercel.

---

## 📁 Project Structure

```
DeccanAI/
├── backend/
│   ├── app.py              # Flask API — /process, /chat endpoints
│   ├── parser.py           # JD keyword extractor
│   ├── matcher.py          # Candidate skill matcher & scorer
│   ├── chatbot.py          # Interest simulator + chat logic
│   ├── utils.py            # Shared helpers
│   └── data/
│       └── candidates.json # Candidate pool (15 profiles)
│
└── frontend/
    ├── public/
    └── src/
        ├── index.js
        ├── App.js
        ├── App.css
        ├── context/
        │   └── AuthContext.js       # Login / logout state
        ├── pages/
        │   └── LoginPage.js / .css  # Animated login screen
        └── components/
            ├── JDInput.js           # Job description textarea
            ├── ResultsTable.js      # Ranked candidate table
            ├── ChatBox.js           # AI candidate chat
            ├── CandidatesPage.js    # Full candidate cards view
            ├── AnalyticsPage.js     # Charts & insights
            ├── JobBoardsPage.js     # Job listings + post job
            ├── SettingsPage.js      # App settings
            └── SignOutModal.js      # Sign out confirmation
```

---

## ⚙️ Local Setup Instructions

### Prerequisites

| Tool | Version |
|------|---------|
| Python | 3.9+ |
| Node.js | 18+ |
| npm | 9+ |

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/deccan-ai-scout.git
cd deccan-ai-scout
```

---

### 2. Backend setup

```bash
cd backend
pip install flask flask-cors
python app.py
```

Backend runs at → **http://localhost:5000**

Test it:
```bash
curl http://localhost:5000/
# → "Backend is running ✅"
```

---

### 3. Frontend setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at → **http://localhost:3000**

---

### 4. Login credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@aiscout.in | Scout@2024 |
| HR Manager | hr.manager@aiscout.in | HRManager@1 |
| Recruiter | recruiter@aiscout.in | Recruit@99 |

---

## 🧠 How the Scoring Works

### Step 1 — JD Parsing (`parser.py`)
The submitted job description is scanned for known skill keywords:
```
Python, Django, Flask, SQL, Java, Spring, React, JavaScript, etc.
```

### Step 2 — Match Score (`matcher.py`)
Each candidate's skill list is compared against the extracted JD skills:
```
match_score = (matched_skills / total_required_skills) × 100
```

### Step 3 — Interest Score (`chatbot.py → simulate_interest`)
Interest is inferred from years of experience:
```
exp >= 3 years  →  interest_score = 90
exp == 2 years  →  interest_score = 70
exp <  2 years  →  interest_score = 40
```

### Step 4 — Final Score
Weighted combination of both scores:
```
final_score = (0.7 × match_score) + (0.3 × interest_score)
```

Candidates are sorted descending by `final_score`.

---

## 📥 Sample Input

**Job Description submitted:**
```
We are looking for a Senior Python Developer with experience in Django and SQL.
The candidate should have strong backend skills and 3+ years of experience.
```

---

## 📤 Sample Output

| Rank | Name  | Match % | Interest % | Final % |
|------|-------|---------|------------|---------|
| 1 | Meena  | 100 | 90 | 97.0 |
| 2 | Rohit  | 67  | 90 | 73.9 |
| 3 | Manish | 67  | 90 | 73.9 |
| 4 | Rahul  | 100 | 70 | 91.0 |
| 5 | Isha   | 100 | 70 | 91.0 |

---

## 🎥 Demo Video Script (3–5 min)

Use this structure when recording:

| Time | What to show |
|------|-------------|
| 0:00–0:30 | Login page → enter credentials → dashboard overview |
| 0:30–1:15 | Paste JD → click Analyze → results appear in table |
| 1:15–2:00 | Click a candidate → use chatbot (ask skills, scores, interview questions) |
| 2:00–2:45 | Switch to Candidates page → filter, search, shortlist |
| 2:45–3:30 | Switch to Analytics → walk through charts |
| 3:30–4:15 | Switch to Job Boards → post a job → see matched candidates |
| 4:15–4:45 | Settings page → show AI config sliders |
| 4:45–5:00 | Sign out → return to login |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────┐
│                  React Frontend                   │
│  Login → Dashboard → Candidates → Analytics       │
│  Job Boards → Settings → ChatBox                  │
└────────────────────┬─────────────────────────────┘
                     │ HTTP (axios)
                     ▼
┌──────────────────────────────────────────────────┐
│              Flask Backend (Python)               │
│                                                   │
│  POST /process                                    │
│    parser.py  →  matcher.py  →  chatbot.py        │
│    JD text    →  skill match  →  interest score   │
│                                                   │
│  POST /chat                                       │
│    chatbot.py → rule-based candidate Q&A          │
└────────────────────┬─────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────┐
│           candidates.json (Data Layer)            │
│  15 profiles: name, skills[], experience (yrs)   │
└──────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, CSS Variables, Recharts |
| Backend | Python, Flask, Flask-CORS |
| Data | JSON flat file (candidates.json) |
| Auth | React Context + sessionStorage |
| Charts | Recharts (Bar, Radar, Scatter, Line) |
| PDF Export | jsPDF |

---

## 📌 Features

- 🔐 Role-based login (Admin / HR Manager / Recruiter)
- 📄 Job description analysis & skill extraction
- 🏆 AI-scored candidate ranking (match + interest + final)
- 💬 Chatbot per candidate (skills, scores, interview questions)
- 📊 Analytics dashboard (8 chart types)
- 📋 Candidate cards with filter, search, shortlist
- ⊕ Job board with post, filter, status management
- ⬇ CSV & PDF export of shortlist
- ⚙️ Settings with AI config, notifications, integrations

---

## 👤 Author

Built for Deccan AI Hackathon submission.