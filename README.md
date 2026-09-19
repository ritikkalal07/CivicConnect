# CivicConnect Autonomous

CivicConnect Autonomous is a civic-intelligence application for detecting, routing, and escalating community issues. It combines public-signal monitoring concepts with citizen reports, location-aware mapping, risk classification, and operational alerts.

## Problem and solution

Community issues are often visible in scattered signals before they reach the right department. CivicConnect creates a shared operational view so issues can be detected, reviewed, routed, and tracked while reports remain available during connectivity loss.

## HackDevengers 2.0

HackDevengers 2.0 is a 24-hour fully virtual Open Innovation Hackathon powered by Unstop and sponsored by Lovable. Participants can choose their own idea, domain, and technology stack to build a practical solution during the event.

### Hackathon details

- **Duration:** 24 hours
- **Start:** 19 September, 10:00 AM
- **End:** 20 September, 10:00 AM
- **Mode:** Fully online / virtual
- **Format:** Open innovation


### CivicConnect submission

CivicConnect addresses a real-world civic safety problem: public issues are often discovered locally but are difficult to detect, verify, route, and share quickly. The app combines structured issue reporting, location-aware mapping, risk classification, operational alerts, and offline synchronization in one installable web application.

**Project title:** CivicConnect Autonomous - Civic Intelligence Platform

**Project description:** A responsive PWA that helps residents report civic issues, attach evidence, share their location, view nearby signals, and identify priority clusters. Reports remain available offline and synchronize automatically when connectivity returns.

**Repository:** This GitHub repository contains the complete project source code, setup instructions, deployment configuration, and validation scenarios.

**Live deployment:** [CivicConnect on Vercel](https://civic-con-nect.vercel.app/)

### Submission requirements

- Project title
- Project description
- GitHub repository link
- Live deployment or demo link, if available
- Presentation, if available

A live deployment or presentation is optional. The project title, description, and GitHub repository are sufficient for core submission and verification.

### Evaluation alignment

- **Innovation:** Converts scattered local signals into shared, actionable civic intelligence.
- **Problem-solving:** Supports structured issue reports, GPS capture, evidence uploads, alerts, and offline use.
- **Technical implementation:** Uses React, TanStack Start, TypeScript, Vite, Leaflet, Vercel Postgres, Vercel Blob, and a service worker.
- **Functionality and UX:** Provides responsive navigation, validation, loading and error states, maps, risk indicators, and mobile-friendly reporting.
- **Real-world impact:** Helps communities identify recurring water concerns faster and make more informed decisions.
- **Scalability:** The API, database schema, alert logic, and PWA architecture can support additional regions, administrators, and public-health workflows.

### Eligibility

The hackathon is open to anyone interested in building innovative technology solutions. Participants may choose any domain, problem statement, technology, or tech stack. Experienced developers and students are equally welcome.

### How to participate

1. Register for HackDevengers 2.0 on Unstop.
2. Start building when the 24-hour event begins on 19 September at 10:00 AM.
3. Submit the project through the Google Form shared in the WhatsApp channel. The form opens at 1:00 PM on 19 September.
4. Include the project details and GitHub repository for evaluation.

Projects are evaluated using the submitted details and GitHub repository. Winners and additional prizes are announced after evaluation.

### Hackathon rules

- The project must be built during the 24-hour hackathon period.
- This is an open innovation hackathon, so any idea and domain may be selected.
- Any programming language, framework, platform, or technology may be used.
- Submit an original project created by you or your team.
- The GitHub repository must contain the relevant code and information needed to understand the project.
- Plagiarism, copied projects, or submissions that violate the hackathon guidelines may be disqualified.
- The submission must be completed within the event timeline.
- The organizers and jury reserve the final decision regarding evaluation and results.

### Rewards

- **INR 50,000:** First prize
- **Top 5:** Exclusive Unstop goodies
- **Top 10:** Lovable credits and `.xyz` domains
- **Additional top 10 prizes:** To be announced
- **All valid submissions:** Certificate of achievement

## Current capabilities

- Civic issue reports with location, structured observations, and photo evidence.
- Browser GPS capture with manual coordinate entry.
- Leaflet and OpenStreetMap safety map with safe, caution, and danger pins.
- Alert feed for three or more danger reports within 1 km in 24 hours.
- Vercel Postgres report storage and Vercel Blob photo storage.
- Offline report queue with automatic synchronization after reconnect.
- Installable PWA with cached application shell, map tiles, and recent reports.
- Loading, validation, empty, and API failure states.

## Tech stack

React 19, TanStack Start, TypeScript, Vite, Tailwind CSS, Leaflet, OpenStreetMap, Vercel Postgres, and Vercel Blob.

## Autonomous roadmap

The current Vercel application is the deployable frontend and first operational slice. The full autonomous architecture requires separate worker services and credentials that cannot run inside a browser-only deployment.

### Implemented in this repository

- Responsive CivicConnect operations overview.
- Human-in-the-loop issue reporting with GPS and photo evidence.
- Risk classification, alert clustering, live map, and offline queue.
- Supervised autonomous triage with explainable priorities and a read-only `/api/agent` status endpoint.
- Server-side coordinate, measurement, image-type, image-size, and filename validation.
- Vercel Postgres and Blob integration boundaries.
- Production TanStack Start/Nitro deployment on Vercel.

### Next service layer

- Harvesters for RSS, government APIs, Open311, public web pages, and document feeds.
- Redis-backed scheduled workers for crawling, deduplication, anomaly detection, and SLA checks.
- Knowledge graph storage for wards, officers, departments, categories, sources, and outcomes.
- Agent services for routing, escalation, verification, chatbot, sentiment, and self-healing.
- Outbound integrations for email, SMS, WhatsApp, IVR, and government complaint systems.

These services need their own runtime such as Railway, a database with PostGIS, Redis, provider credentials, rate-limit handling, source permissions, and an explicit human-approval policy before autonomous actions can safely be enabled.

The current agent intentionally has no autonomous outbound side effects. It does not contact officials, post to social networks, send messages, or file complaints automatically. Those actions must be added behind authenticated worker services, audit logs, rate limits, source permissions, confidence thresholds, and a human approval policy.

## Local setup

```sh
npm install
npm run dev
```

Open the local URL printed by Vite.

## Environment variables

Create a `.env.local` file for local development:

```env
POSTGRES_URL=postgres://...
BLOB_READ_WRITE_TOKEN=vercel_blob_...
```

`POSTGRES_URL` is used by the report API. `BLOB_READ_WRITE_TOKEN` is used for optional photo storage. The API creates the `reports` table on first use with columns `id`, `latitude`, `longitude`, `area`, `clarity`, `smell`, `color`, `ph`, `tds`, `turbidity`, `photo_url`, and `created_at`.

## Deployment on Vercel

1. Import the repository into Vercel.
2. Set `POSTGRES_URL` and `BLOB_READ_WRITE_TOKEN` in the project environment settings.
3. Use the default build command `npm run build` and output settings provided by the project.
4. Deploy. The first successful report request creates the database table.

## Validation scenarios

1. Classify a clean observation as safe.
2. Classify a severe observation as high priority.
3. Create one priority alert for three nearby high-risk reports within 1 km and 24 hours.
4. Do not create an alert for an old or isolated issue.
5. Submit an issue with required location and structured observations.
6. Reject a submission with missing required fields.
7. Attach photo evidence and show it in issue details.
8. Use GPS to fill the issue location, including permission-denied and timeout states.
9. Submit while offline and synchronize after reconnecting.
10. Show loading, empty, and API failure states.
11. Confirm active navigation at mobile and desktop widths.
12. Confirm the live map renders issue markers and selection details.
13. Confirm the PWA manifest, service worker, and CivicConnect icon load.
14. Confirm Vercel deployment with `POSTGRES_URL` and `BLOB_READ_WRITE_TOKEN` configured.
15. Keep autonomous outbound actions behind explicit worker services and human approval until source permissions, confidence thresholds, and audit logs are configured.
16. Confirm invalid coordinates, measurements, and oversized or non-image uploads are rejected by the API.
17. Confirm each accepted report receives an explainable supervised-agent assessment.

Run the available checks with:

```sh
npm run lint
npm run build
npm test
```
