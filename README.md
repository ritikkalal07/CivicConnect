# JalDarpan

JalDarpan is a community water safety application. Residents can report water quality observations, attach evidence, share their location, and see nearby reports and safety alerts.

## Problem and solution

Water concerns are often noticed locally before they are formally recorded. JalDarpan creates a simple reporting path and a shared map so communities can identify patterns quickly while keeping reports available during connectivity loss.

## HackDevengers 2.0

HackDevengers 2.0 is a 24-hour fully virtual Open Innovation Hackathon powered by Unstop and sponsored by Lovable. Participants can choose their own idea, domain, and technology stack to build a practical solution during the event.

### Hackathon details

- **Duration:** 24 hours
- **Start:** 19 September, 10:00 AM
- **End:** 20 September, 10:00 AM
- **Mode:** Fully online / virtual
- **Format:** Open innovation
- **Participation:** Developers, students, creators, designers, innovators, and technology enthusiasts
- **Prize pool:** INR 50,000 cash prize plus additional rewards

### JalDarpan submission

JalDarpan addresses a real-world community safety problem: water quality concerns are often discovered locally but are difficult to report, verify, and share quickly. The app combines structured reporting, location-aware mapping, risk classification, community alerts, photo evidence, and offline synchronization in one installable web application.

**Project title:** JalDarpan - Community Water Safety

**Project description:** A responsive PWA that helps residents report water quality observations, attach evidence, share their location, view nearby safety reports, and identify clusters of dangerous observations. Reports remain available offline and synchronize automatically when connectivity returns.

**Repository:** This GitHub repository contains the complete project source code, setup instructions, deployment configuration, and validation scenarios.

**Live deployment:** [JalDarpan on Vercel](https://jal-d-arpan.vercel.app/)

### Submission requirements

- Project title
- Project description
- GitHub repository link
- Live deployment or demo link, if available
- Presentation, if available

A live deployment or presentation is optional. The project title, description, and GitHub repository are sufficient for core submission and verification.

### Evaluation alignment

- **Innovation:** Converts local water observations into shared, actionable safety information.
- **Problem-solving:** Supports structured reports, GPS capture, evidence uploads, alerts, and offline use.
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

## Features

- Water quality reports with location, clarity, smell, color, pH, TDS, turbidity, and photo.
- Browser GPS capture with manual coordinate entry.
- Leaflet and OpenStreetMap safety map with safe, caution, and danger pins.
- Alert feed for three or more danger reports within 1 km in 24 hours.
- Vercel Postgres report storage and Vercel Blob photo storage.
- Offline report queue with automatic synchronization after reconnect.
- Installable PWA with cached application shell, map tiles, and recent reports.
- Loading, validation, empty, and API failure states.

## Tech stack

React 19, TanStack Start, TypeScript, Vite, Tailwind CSS, Leaflet, OpenStreetMap, Vercel Postgres, and Vercel Blob.

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

1. Submit an online report with all fields and a photo.
2. Submit an online report with only required fields.
3. Submit while offline, reconnect, and confirm synchronization.
4. Confirm safe, caution, and danger pin colors.
5. Confirm an alert for three danger reports within 1 km and 24 hours.
6. Confirm no alert for fewer than three matching reports.
7. Confirm missing location or clarity prevents submission.
8. Confirm uploaded photos appear in map details.
9. Confirm GPS fills latitude and longitude.
10. Confirm the empty state on a new installation.
11. Confirm loading state while reports are fetched.
12. Confirm the API error state when the database is unavailable.
13. Confirm the browser install prompt after service worker registration.
14. Check the layout at 375px width.
15. Confirm Vercel deployment with both environment variables configured.

Run the available checks with:

```sh
npm run lint
npm run build
```
