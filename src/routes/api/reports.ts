import { createFileRoute } from "@tanstack/react-router";
import { put } from "@vercel/blob";
import { sql } from "@vercel/postgres";
import { assessReport } from "@/lib/autonomous";

const allowedClarities = new Set(["clear", "cloudy", "turbid"]);
const allowedSmells = new Set(["none", "earthy", "sewage", "chemical"]);
const allowedColors = new Set(["clear", "yellow", "brown", "green", "other"]);
const MAX_PHOTO_BYTES = 5_000_000;

export const Route = createFileRoute("/api/reports")({
  server: {
    handlers: {
      GET: async () => {
        try {
          await ensureSchema();
          const { rows } =
            await sql`SELECT id, latitude, longitude, area, clarity, smell, color, ph, tds, turbidity, photo_url AS "photoUrl", created_at AS "createdAt" FROM reports ORDER BY created_at DESC LIMIT 50`;
          return Response.json(rows.map((row) => ({ ...row, status: "synced" })));
        } catch {
          return Response.json({ error: "Reports are unavailable" }, { status: 503 });
        }
      },
      POST: async ({ request }) => {
        try {
          const form = await request.formData();
          const latitude = numberField(form, "latitude");
          const longitude = numberField(form, "longitude");
          const area = textField(form, "area") || "Community location";
          const clarity = textField(form, "clarity");
          const smell = textField(form, "smell");
          const color = textField(form, "color");
          if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude) ||
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180 ||
            !allowedClarities.has(clarity) ||
            !allowedSmells.has(smell) ||
            !allowedColors.has(color)
          )
            return Response.json({ error: "Invalid report fields" }, { status: 400 });
          let photoUrl: string | null = null;
          const photo = form.get("photo");
          if (photo instanceof File && photo.size > 0) {
            if (!photo.type.startsWith("image/") || photo.size > MAX_PHOTO_BYTES)
              return Response.json(
                { error: "Photo must be an image smaller than 5 MB" },
                { status: 400 },
              );
            const safeName = photo.name.replace(/[^a-zA-Z0-9._-]/g, "_");
            const blob = await put(`reports/${crypto.randomUUID()}-${safeName}`, photo, {
              access: "public",
            });
            photoUrl = blob.url;
          }
          await ensureSchema();
          const createdAt = Date.now();
          const id = crypto.randomUUID();
          const ph = optionalNumber(form, "ph");
          const tds = optionalNumber(form, "tds");
          const turbidity = optionalNumber(form, "turbidity");
          if (
            (ph !== null && (!Number.isFinite(ph) || ph < 0 || ph > 14)) ||
            (tds !== null && (!Number.isFinite(tds) || tds < 0)) ||
            (turbidity !== null && (!Number.isFinite(turbidity) || turbidity < 0))
          )
            return Response.json({ error: "Invalid measurement values" }, { status: 400 });
          const assessment = assessReport({ clarity, smell, color });
          await sql`INSERT INTO reports (id, latitude, longitude, area, clarity, smell, color, ph, tds, turbidity, photo_url, created_at) VALUES (${id}, ${latitude}, ${longitude}, ${area}, ${clarity}, ${smell}, ${color}, ${ph}, ${tds}, ${turbidity}, ${photoUrl}, ${createdAt})`;
          return Response.json({
            id,
            latitude,
            longitude,
            area,
            clarity,
            smell,
            color,
            ph,
            tds,
            turbidity,
            photoUrl: photoUrl ?? undefined,
            createdAt,
            status: "synced",
            agent: assessment,
          });
        } catch {
          return Response.json({ error: "The report could not be saved" }, { status: 503 });
        }
      },
    },
  },
});

async function ensureSchema() {
  await sql`CREATE TABLE IF NOT EXISTS reports (id TEXT PRIMARY KEY, latitude DOUBLE PRECISION NOT NULL, longitude DOUBLE PRECISION NOT NULL, area TEXT NOT NULL, clarity TEXT NOT NULL, smell TEXT NOT NULL, color TEXT NOT NULL, ph DOUBLE PRECISION, tds DOUBLE PRECISION, turbidity DOUBLE PRECISION, photo_url TEXT, created_at BIGINT NOT NULL)`;
}
function textField(form: FormData, key: string) {
  return String(form.get(key) ?? "")
    .trim()
    .toLowerCase();
}
function numberField(form: FormData, key: string) {
  return Number(form.get(key));
}
function optionalNumber(form: FormData, key: string) {
  const value = form.get(key);
  return value === null || value === "" ? null : Number(value);
}
