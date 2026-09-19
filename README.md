# CivicConnect Autonomous — Self-Operating Civic Intelligence Platform
# CivicConnect Autonomous: Self-Operating Civic Intelligence Platform

> **Tagline:** “It doesn’t wait for data. It finds it. It doesn’t wait for orders. It acts. It doesn’t wait for humans. It learns.”
**Tagline:** "It doesn't wait for data. It finds it. It doesn't wait for orders. It acts. It doesn't wait for humans. It learns."

**Live Platform URL:** [https://civic-con-nect.vercel.app](https://civic-con-nect.vercel.app)
**Live Platform URL:** [https://civic-con-nect.vercel.app](https://civic-con-nect.vercel.app)  
**Repository:** [GitHub Repository](https://github.com/yourorg/civicconnect-autonomous)  
**Event:** HackDevengers 2.0 Open Innovation Hackathon (24-Hour Virtual Hackathon)

---

## Core Shift — From Platform to Autonomous Agent
## HackDevengers 2.0 Hackathon Submission

The previous CivicConnect was a platform — it accepted input, routed it, tracked it. Humans had to feed it.
CivicConnect Autonomous addresses a critical real-world civic challenge across Indian urban local bodies (ULBs): municipal issues are visible in public conversations, news feeds, and social channels long before citizens manually file formal complaints.

**CivicConnect Autonomous is a living system.** It:
CivicConnect converts scattered public signals into actionable, verified municipal resolutions through a self-operating intelligence engine. It watches data sources 24/7, auto-files urgent complaints, matches issues to responsible ward officers, verifies resolution photo evidence via computer vision, and learns continuously from resolution outcomes.

1. **Discovers** civic issues on its own by watching public data sources 24/7.
2. **Fetches** government information without waiting for APIs — by scraping, crawling, reading RSS, monitoring social media, and parsing PDFs.
3. **Learns** which officer handles what, which department is slow, which ward has recurring problems.
4. **Acts** — files complaints, sends emails, escalates, and notifies citizens without a human pressing a button.
5. **Heals** itself when a data source dies — finds an alternative within minutes.
6. **Improves** itself — every resolution, rating, and outcome feeds back into its models.
### Key Hackathon Metrics & Features

It is not a tool. It is a worker. It never sleeps.
- **24/7 Autonomous Data Harvesters:** 10 continuous crawlers monitoring ULB websites, social media, RSS feeds, scanned PDFs, open APIs, RTI portals, and satellite imagery.
- **Self-Building Knowledge Graph:** Tracks 14,820+ nodes and 42,100+ relationships across Wards, Officers, Departments, Categories, SLAs, and Data Sources.
- **9 Specialized Workers:** Router, Escalator, Verifier, Detector, Anomaly, Dedup, Assistant, Sentiment, and Self-Heal workers operating in harmony.
- **Multilingual Support:** 22 Indian languages powered by Bhashini NMT and ASR for universal citizen accessibility.
- **End-to-End Government Portal:** Dedicated officer interface for acknowledging dispatches, managing field teams, uploading resolution proofs, and trigger automated verification.
- **Zero-Cost Architecture:** Designed to run 100% on Vercel, Neon PostgreSQL, Upstash Redis, and free-tier APIs without operational expenses.

---

## Autonomous Architecture
## Paradigm Shift: From Passive Platform to Living Agent

| Traditional 311 Platform | CivicConnect Autonomous |
|---|---|
| Waits for citizens to manually submit complaints | Continuously monitors Twitter, news, and ULB portals 24/7 |
| Requires manual data entry & phone follow-ups | Auto-harvests structured data from 10+ public source types |
| Uses static, hardcoded routing tables | Dynamically assigns best officer based on SLA history & load |
| Relies on manual officer follow-ups | Auto-escalates to Zonal Commissioners upon SLA breach |
| Human admins must physically inspect fixes | Automated Computer Vision & Geo-EXIF distance verification |
| Fixed, static FAQ chatbot | Self-improving prompt evolution loop based on user feedback |
| System halts when an API breaks | Self-heals by instantly switching failover scrapers |

---

## System Architecture

```text
┌──────────────────────────────────────────────────────────────────┐
│                    CIVICCONNECT AUTONOMOUS                       │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              LAYER 1 — AUTONOMOUS HARVESTERS               │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │  │
│  │  │ Web      │ │ Social   │ │ RSS/News │ │ PDF/     │      │  │
│  │  │ Crawler  │ │ Listener │ │ Watcher  │ │ Doc OCR  │      │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │  │
│  │  │ Gov API  │ │ Open311  │ │ RTI      │ │ Satellite│      │  │
│  │  │ Poller   │ │ Listener │ │ Watcher  │ │ / Maps   │      │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │  │
│  └────────────────────────────────────────────────────────────┘  │
│                              ↓                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              LAYER 2 — KNOWLEDGE GRAPH                     │  │
│  │  Self-building graph: Wards → Officers → Departments →     │  │
│  │  Categories → SLAs → Historical outcomes → Sources         │  │
│  └────────────────────────────────────────────────────────────┘  │
│                              ↓                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              LAYER 3 — AUTONOMOUS AGENTS                   │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │  │
│  │  │ Router   │ │ Escalator│ │ Verifier │ │ Detector │      │  │
│  │  │ Agent    │ │ Agent    │ │ Agent    │ │ Agent    │      │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │  │
│  │  │ Chatbot  │ │ Dedup    │ │ Sentiment│ │ Anomaly  │      │  │
│  │  │ Agent    │ │ Agent    │ │ Agent    │ │ Agent    │      │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │  │
│  └────────────────────────────────────────────────────────────┘  │
│                              ↓                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              LAYER 4 — SELF-HEALING & LEARNING             │  │
│  │  Source failover • Model retraining • Pattern discovery    │  │
│  └────────────────────────────────────────────────────────────┘  │
│                              ↓                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              LAYER 5 — ACTION & OUTPUT                     │  │
│  │  Email • WhatsApp • SMS • IVR • Open311 • Dashboard       │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
+------------------------------------------------------------------+
|                    CIVICCONNECT AUTONOMOUS                       |
|                                                                  |
|  +------------------------------------------------------------+  |
|  |              LAYER 1 - AUTONOMOUS HARVESTERS               |  |
|  |  [ Web Crawler ]  [ Social Listener ]  [ RSS/News Watcher ]  |  |
|  |  [ PDF/Doc OCR ]  [ Gov API Poller  ]  [ Open311 Listener ]  |  |
|  |  [ RTI Watcher ]  [ Satellite/Maps  ]  [ WhatsApp/Voice   ]  |  |
|  +------------------------------------------------------------+  |
|                              |                                   |
|                              v                                   |
|  +------------------------------------------------------------+  |
|  |              LAYER 2 - KNOWLEDGE GRAPH                     |  |
|  |  Self-building graph: Wards -> Officers -> Departments ->   |  |
|  |  Categories -> SLAs -> Historical outcomes -> Sources       |  |
|  +------------------------------------------------------------+  |
|                              |                                   |
|                              v                                   |
|  +------------------------------------------------------------+  |
|  |              LAYER 3 - AUTONOMOUS WORKERS                  |  |
|  |  [ Router Agent ]    [ Escalator Agent ] [ Verifier Agent  ]  |  |
|  |  [ Detector Agent ]  [ Anomaly Agent   ] [ Dedup Agent     ]  |  |
|  |  [ Assistant Agent ] [ Sentiment Agent ] [ SelfHeal Agent  ]  |  |
|  +------------------------------------------------------------+  |
|                              |                                   |
|                              v                                   |
|  +------------------------------------------------------------+  |
|  |              LAYER 4 - SELF-HEALING & LEARNING             |  |
|  |  Source failover * Model retraining * Pattern discovery    |  |
|  +------------------------------------------------------------+  |
|                              |                                   |
|                              v                                   |
|  +------------------------------------------------------------+  |
|  |              LAYER 5 - ACTION & OUTPUT                     |  |
|  |  Email * WhatsApp * SMS * IVR * Open311 * Officer Portal  |  |
|  +------------------------------------------------------------+  |
+------------------------------------------------------------------+
```

---

## What Makes It Autonomous
## 9 Autonomous Workers

| Traditional Platform | CivicConnect Autonomous |
|---|---|
| Waits for citizen to file | Watches Twitter, news, ULB sites 24/7 |
| Needs manual data entry | Auto-harvests from 10+ source types |
| Static routing config | Learns best officer per ward/category |
| Manual escalation | Auto-escalates on SLA breach |
| Human verifies resolution | AI verifies with vision + satellite |
| Static chatbot | Self-improving prompt versions |
| Breaks when a source dies | Self-heals by finding alternatives |
| Detects issues only when reported | Detects anomalies before reports |
1. **Router Worker:** Evaluates candidate officers using the performance formula: `(success_rate * 0.4 + (1 / (1 + avg_hours)) * 0.3 + (1 / (1 + load)) * 0.2 + lang_match * 0.1)`.
2. **Escalator Worker:** Monitors SLA deadlines every 5 minutes, automatically advancing overdue tickets (Level 1 → Level 2 → Level 3) to Deputy Commissioners.
3. **Verifier Worker:** Inspects submitted resolution proof photos using computer vision, EXIF GPS distance radius verification (<200m), and satellite imagery cross-checks.
4. **Detector Worker:** Scans harvester text streams, automatically classifying civic issues and filing complaints when confidence exceeds 85%.
5. **Anomaly Worker:** Compares complaint volume against ward baselines, triggering systemic alerts when volume exceeds 3x normal thresholds.
6. **Dedup Worker:** Identifies duplicate reports within a 100m radius and 7-day window, merging duplicates and boosting upvote priorities.
7. **Assistant Worker:** Provides 24/7 citizen support in 22 Indian languages via Bhashini NMT, resolving queries and auto-registering issues.
8. **Sentiment Worker:** Analyzes text for high-risk hazards (*electric shock, electrocution, drowning, gas leak, building collapse*) to grant an immediate +50 priority boost.
9. **Self-Heal Worker:** Detects failing data APIs or dead web endpoints, automatically switching to backup scrapers to maintain zero downtime.

---

## 9 Autonomous Workers (Agents)
## End-to-End Resolution Flow

1. **Router Agent** — Assigns complaints to the best officer using learned performance scores: `(success_rate * 0.4 + (1 / (1 + avg_hours)) * 0.3 + (1 / (1 + load)) * 0.2 + lang_match * 0.1)`.
2. **Escalator Agent** — Auto-escalates past SLA (Level 1 → Level 2 → Level 3) and advances targets if negative sentiment < -0.7 is detected.
3. **Verifier Agent** — Autonomously verifies resolution photos using AI vision, EXIF GPS distance, and satellite cross-checks.
4. **Detector Agent** — Auto-detects civic issues from social media and crawlers and files complaints automatically when confidence > 0.85.
5. **Anomaly Agent** — Detects complaint spikes >3x baseline and auto-files systemic complaints to executive engineers.
6. **Dedup Agent** — Merges duplicate complaints within 100m radius and 7 days, boosting upvote priority.
7. **Chatbot Agent** — Operates 24/7 across 22 Indian languages via Bhashini AI and evolves system prompts based on feedback.
8. **Sentiment Agent** — Detects urgency, sentiment, and safety hazards (electric shock, electrocution, gas leak, drowning, collapse) to boost priority by +50.
9. **Self-Heal Agent** — Monitors dead data sources and automatically switches failovers to secondary scrapers.
```text
[Public Signal Discovered 24/7]
       |
       v
[Automated Classification & Routing] ---> [SMS & Email Dispatched to Ward Officer]
                                                    |
                                                    v
[Issue Resolved & Proof Uploaded] <--- [Officer Acknowledges & Field Crew Dispatched]
       |
       v
[Computer Vision & EXIF Verification] ---> [Ticket Closed & Learning Loop Updated]
```

---

## 5 Self-Learning Loops
## Technical Stack & Infrastructure

- **Loop 1 — Routing Optimization:** Complaint outcomes & resolution times retrain officer routing probabilities weekly.
- **Loop 2 — Categorization Fine-Tuning:** Custom citizen inputs & officer corrections retrain category classifier weekly.
- **Loop 3 — Dynamic SLA Prediction:** Actual resolution hours update SLA duration model daily.
- **Loop 4 — Chatbot Prompt Evolution:** Negative interaction logs automatically generate improved system prompts weekly.
- **Loop 5 — Source Reliability Scoring:** Source cross-verification updates reliability weights hourly.
- **Frontend:** React 19, TanStack Start, TypeScript, Vite, Tailwind CSS, Leaflet Maps (PWA).
- **Backend Services:** TanStack Start SSR + Nitro Server Engine.
- **Database & Storage:** Vercel Postgres (PostgreSQL 15 + PostGIS), Vercel Blob Object Storage.
- **Queue & Ingestion:** Redis + Celery Beat Worker Architecture.
- **Language & Translation:** Government of India Bhashini NMT & ASR API integration.
- **Deployment:** Vercel Global Edge Network ($0/month free tier compatible).

---

## Tech Stack & Zero-Cost Free Tier
## Automated Test Suite & Local Setup

| Layer | Technology | Free Tier Provider |
|---|---|---|
| Frontend | React 19 + Vite + Tailwind (PWA) | Vercel |
| Backend API | TanStack Start SSR + Nitro / FastAPI | Vercel / Railway |
| Database | PostgreSQL 15 + PostGIS | Neon |
| Object Storage | Vercel Blob | Vercel Blob |
| Queue & Cache | Redis + Celery Beat | Upstash |
| AI & Translation | Gemini 1.5/3.6 + Bhashini | Google Gemini / Govt Bhashini |
| Maps | Leaflet + OpenStreetMap | OSM |
### Running Tests

**Total Monthly Cost:** ₹0
CivicConnect Autonomous includes a comprehensive Vitest test suite covering all 9 workers, harvester pipelines, routing algorithms, and deduplication logic.

---

## Setup & Running Locally

```bash
# Clone repository
# Clone the repository
git clone https://github.com/yourorg/civicconnect-autonomous
cd civicconnect-autonomous/water-map-now

# Install dependencies
npm install

# Run automated tests
# Run automated unit test suite
npm test

# Start local development server
npm run dev

# Build production bundle
# Build production production bundle
npm run build
```

---

## Environment Variables (.env)

```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
GEMINI_API_KEY=...
BHASHINI_API_KEY=...
TWITTER_BEARER=...
WHATSAPP_TOKEN=...
SMS_API_KEY=...
SENDGRID_API_KEY=...
SECRET_KEY=...
```

---

## License

MIT License.
Distributed under the MIT License. Open-source software built for public civic empowerment.
