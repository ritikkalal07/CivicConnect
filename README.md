# JalDarpan

JalDarpan is a community water safety application. Residents can report water quality observations, attach evidence, share their location, and see nearby reports and safety alerts.

## Problem and solution

Water concerns are often noticed locally before they are formally recorded. JalDarpan creates a simple reporting path and a shared map so communities can identify patterns quickly while keeping reports available during connectivity loss.

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
