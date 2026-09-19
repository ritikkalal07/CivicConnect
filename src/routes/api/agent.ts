import { createFileRoute } from "@tanstack/react-router";
import { sql } from "@vercel/postgres";

import { assessReport, buildAgentSnapshot } from "@/lib/autonomous";
import type { WaterReport } from "@/lib/reports";

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
        }
      },
    },
  },
});

async function ensureSchema() {
  await sql`CREATE TABLE IF NOT EXISTS reports (id TEXT PRIMARY KEY, latitude DOUBLE PRECISION NOT NULL, longitude DOUBLE PRECISION NOT NULL, area TEXT NOT NULL, clarity TEXT NOT NULL, smell TEXT NOT NULL, color TEXT NOT NULL, ph DOUBLE PRECISION, tds DOUBLE PRECISION, turbidity DOUBLE PRECISION, photo_url TEXT, created_at BIGINT NOT NULL)`;
}
