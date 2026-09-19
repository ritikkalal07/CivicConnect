import { createFileRoute } from "@tanstack/react-router";
import { sql } from "@vercel/postgres";

import { assessReport, buildAgentSnapshot } from "@/lib/autonomous";
import type { WaterReport } from "@/lib/reports";

const fallbackReports: WaterReport[] = [
  {
    id: "auto-rep-101",
    latitude: 12.925,
    longitude: 77.5938,
    area: "Ward 47 (Jayanagar 4th Block)",
    clarity: "turbid",
    smell: "sewage",
    color: "brown",
    createdAt: Date.now() - 15 * 60 * 1000,
    status: "synced",
  },
  {
    id: "auto-rep-102",
    latitude: 12.9716,
    longitude: 77.5946,
    area: "Bengaluru Central (Ward 12)",
    clarity: "turbid",
    smell: "chemical",
    color: "yellow",
    createdAt: Date.now() - 45 * 60 * 1000,
    status: "synced",
  },
];

export const Route = createFileRoute("/api/agent")({
  server: {
    handlers: {
      GET: async () => {
        try {
          await ensureSchema();
          const { rows } = await sql`
            SELECT id, latitude, longitude, area, clarity, smell, color,
              ph, tds, turbidity, photo_url AS "photoUrl", created_at AS "createdAt"
            FROM reports
            ORDER BY created_at DESC
            LIMIT 200
          `;
          const reports = rows.map((row) => ({
            ...row,
            status: "synced" as const,
          })) as WaterReport[];
          return Response.json({
            agent: buildAgentSnapshot(reports),
            assessments: reports.map((report) => ({ id: report.id, ...assessReport(report) })),
          });
        } catch {
          return Response.json({ error: "Agent status is unavailable" }, { status: 503 });
          // Graceful fallback if database is not connected
          return Response.json({
            agent: buildAgentSnapshot(fallbackReports),
            assessments: fallbackReports.map((report) => ({ id: report.id, ...assessReport(report) })),
          });
        }
      },
    },
  },
});

async function ensureSchema() {
  await sql`CREATE TABLE IF NOT EXISTS reports (id TEXT PRIMARY KEY, latitude DOUBLE PRECISION NOT NULL, longitude DOUBLE PRECISION NOT NULL, area TEXT NOT NULL, clarity TEXT NOT NULL, smell TEXT NOT NULL, color TEXT NOT NULL, ph DOUBLE PRECISION, tds DOUBLE PRECISION, turbidity DOUBLE PRECISION, photo_url TEXT, created_at BIGINT NOT NULL)`;
}
