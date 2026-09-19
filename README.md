# CivicConnect Autonomous — Self-Operating Civic Intelligence Platform

> **Tagline:** “It doesn’t wait for data. It finds it. It doesn’t wait for orders. It acts. It doesn’t wait for humans. It learns.”

**Live Platform URL:** [https://civic-con-nect.vercel.app](https://civic-con-nect.vercel.app)

---

## Core Shift — From Platform to Autonomous Agent

The previous CivicConnect was a platform — it accepted input, routed it, tracked it. Humans had to feed it.

**CivicConnect Autonomous is a living system.** It:

1. **Discovers** civic issues on its own by watching public data sources 24/7.
2. **Fetches** government information without waiting for APIs — by scraping, crawling, reading RSS, monitoring social media, and parsing PDFs.
3. **Learns** which officer handles what, which department is slow, which ward has recurring problems.
4. **Acts** — files complaints, sends emails, escalates, and notifies citizens without a human pressing a button.
5. **Heals** itself when a data source dies — finds an alternative within minutes.
6. **Improves** itself — every resolution, rating, and outcome feeds back into its models.

It is not a tool. It is a worker. It never sleeps.

---

## Autonomous Architecture

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
```

---

## What Makes It Autonomous

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

---

## 9 Autonomous Workers (Agents)

1. **Router Agent** — Assigns complaints to the best officer using learned performance scores: `(success_rate * 0.4 + (1 / (1 + avg_hours)) * 0.3 + (1 / (1 + load)) * 0.2 + lang_match * 0.1)`.
2. **Escalator Agent** — Auto-escalates past SLA (Level 1 → Level 2 → Level 3) and advances targets if negative sentiment < -0.7 is detected.
3. **Verifier Agent** — Autonomously verifies resolution photos using AI vision, EXIF GPS distance, and satellite cross-checks.
4. **Detector Agent** — Auto-detects civic issues from social media and crawlers and files complaints automatically when confidence > 0.85.
5. **Anomaly Agent** — Detects complaint spikes >3x baseline and auto-files systemic complaints to executive engineers.
6. **Dedup Agent** — Merges duplicate complaints within 100m radius and 7 days, boosting upvote priority.
7. **Chatbot Agent** — Operates 24/7 across 22 Indian languages via Bhashini AI and evolves system prompts based on feedback.
8. **Sentiment Agent** — Detects urgency, sentiment, and safety hazards (electric shock, electrocution, gas leak, drowning, collapse) to boost priority by +50.
9. **Self-Heal Agent** — Monitors dead data sources and automatically switches failovers to secondary scrapers.

---

## 5 Self-Learning Loops

- **Loop 1 — Routing Optimization:** Complaint outcomes & resolution times retrain officer routing probabilities weekly.
- **Loop 2 — Categorization Fine-Tuning:** Custom citizen inputs & officer corrections retrain category classifier weekly.
- **Loop 3 — Dynamic SLA Prediction:** Actual resolution hours update SLA duration model daily.
- **Loop 4 — Chatbot Prompt Evolution:** Negative interaction logs automatically generate improved system prompts weekly.
- **Loop 5 — Source Reliability Scoring:** Source cross-verification updates reliability weights hourly.

---

## Tech Stack & Zero-Cost Free Tier

| Layer | Technology | Free Tier Provider |
|---|---|---|
| Frontend | React 19 + Vite + Tailwind (PWA) | Vercel |
| Backend API | TanStack Start SSR + Nitro / FastAPI | Vercel / Railway |
| Database | PostgreSQL 15 + PostGIS | Neon |
| Object Storage | Vercel Blob | Vercel Blob |
| Queue & Cache | Redis + Celery Beat | Upstash |
| AI & Translation | Gemini 1.5/3.6 + Bhashini | Google Gemini / Govt Bhashini |
| Maps | Leaflet + OpenStreetMap | OSM |

**Total Monthly Cost:** ₹0

---

## Setup & Running Locally

```bash
# Clone repository
git clone https://github.com/yourorg/civicconnect-autonomous
cd civicconnect-autonomous/water-map-now

# Install dependencies
npm install

# Run automated tests
npm test

# Start local development server
npm run dev

# Build production bundle
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
