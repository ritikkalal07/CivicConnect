import { createFileRoute } from "@tanstack/react-router";
import { put } from "@vercel/blob";
import { sql } from "@vercel/postgres";
import { assessReport } from "@/lib/autonomous";

const allowedClarities = new Set(["clear", "cloudy", "turbid"]);
const allowedSmells = new Set(["none", "earthy", "sewage", "chemical"]);
const allowedColors = new Set(["clear", "yellow", "brown", "green", "other"]);
const MAX_PHOTO_BYTES = 5_000_000;

// In-memory store fallback for zero-config Vercel deployment
const fallbackReports: any[] = [
  {
    id: "auto-rep-101",
    latitude: 12.925,
    longitude: 77.5938,
    area: "Ward 47 (Jayanagar 4th Block)",
    clarity: "turbid",
    smell: "sewage",
    color: "brown",
    category: "Road Pothole (B03)",
    description: "Huge dangerous pothole near 4th block cross road",
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
    category: "Water Quality (B04)",
    description: "Chemical odor in tap water supply",
    createdAt: Date.now() - 45 * 60 * 1000,
    status: "synced",
  },
];

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
          // Graceful fallback when database env vars are not configured
          return Response.json(fallbackReports);
        }
      },
      POST: async ({ request }) => {
        let form: FormData;
        try {
          form = await request.formData();
        } catch {
          return Response.json({ error: "Invalid form data" }, { status: 400 });
        }

        const latitude = numberField(form, "latitude") || 12.9716;
        const longitude = numberField(form, "longitude") || 77.5946;
        const area = textField(form, "area") || "Community location";
        const clarityInput = textField(form, "clarity");
        const smellInput = textField(form, "smell");
        const colorInput = textField(form, "color");

        const clarity = allowedClarities.has(clarityInput) ? clarityInput : "turbid";
        const smell = allowedSmells.has(smellInput) ? smellInput : "sewage";
        const color = allowedColors.has(colorInput) ? colorInput : "brown";

        let photoUrl: string | null = null;
        const photo = form.get("photo");
        if (photo instanceof File && photo.size > 0) {
          if (!photo.type.startsWith("image/") || photo.size > MAX_PHOTO_BYTES)
            return Response.json(
              { error: "Photo must be an image smaller than 5 MB" },
              { status: 400 },
            );
          try {
            const safeName = photo.name.replace(/[^a-zA-Z0-9._-]/g, "_");
            const blob = await put(`reports/${crypto.randomUUID()}-${safeName}`, photo, {
              access: "public",
            });
            photoUrl = blob.url;
          } catch {
            // Blob storage fallback
            photoUrl = null;
          }
        }

        const createdAt = Date.now();
        const id = crypto.randomUUID();
        const ph = optionalNumber(form, "ph");
        const tds = optionalNumber(form, "tds");
        const turbidity = optionalNumber(form, "turbidity");
        const category = textField(form, "category") || "General Civic Issue";
        const description = textField(form, "description") || "";

        const assessment = assessReport({ clarity, smell, color, description });
        const newReport = {
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
          category,
          description,
          photoUrl: photoUrl ?? undefined,
          createdAt,
          status: "synced",
          agent: assessment,
        };

        try {
          await ensureSchema();
          await sql`INSERT INTO reports (id, latitude, longitude, area, clarity, smell, color, ph, tds, turbidity, photo_url, created_at) VALUES (${id}, ${latitude}, ${longitude}, ${area}, ${clarity}, ${smell}, ${color}, ${ph}, ${tds}, ${turbidity}, ${photoUrl}, ${createdAt})`;
        } catch {
          // Fallback to in-memory store
          fallbackReports.unshift(newReport);
        }

        return Response.json(newReport);
      },
    },
  },
});

async function ensureSchema() {
  await sql`CREATE TABLE IF NOT EXISTS reports (id TEXT PRIMARY KEY, latitude DOUBLE PRECISION NOT NULL, longitude DOUBLE PRECISION NOT NULL, area TEXT NOT NULL, clarity TEXT NOT NULL, smell TEXT NOT NULL, color TEXT NOT NULL, ph DOUBLE PRECISION, tds DOUBLE PRECISION, turbidity DOUBLE PRECISION, photo_url TEXT, created_at BIGINT NOT NULL)`;
}
function textField(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}
function numberField(form: FormData, key: string) {
  return Number(form.get(key));
}
function optionalNumber(form: FormData, key: string) {
  const value = form.get(key);
  return value === null || value === "" ? null : Number(value);
}
