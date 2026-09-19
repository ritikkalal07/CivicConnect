import { createFileRoute } from "@tanstack/react-router";
import { sql } from "@vercel/postgres";

export const Route = createFileRoute("/api/feedback")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as Record<string, unknown>;
          const name = textField(body.name).slice(0, 80) || "Anonymous resident";
          const comment = textField(body.comment).slice(0, 500);
          const rating = Number(body.rating);
          const honeypot = textField(body.website);

          if (
            honeypot ||
            !Number.isInteger(rating) ||
            rating < 1 ||
            rating > 5 ||
            comment.length < 10
          )
            return Response.json(
              { error: "Please provide a rating and a longer comment" },
              { status: 400 },
            );

          await sql`CREATE TABLE IF NOT EXISTS public_feedback (id TEXT PRIMARY KEY, name TEXT NOT NULL, rating INTEGER NOT NULL, comment TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', created_at BIGINT NOT NULL)`;
          await sql`INSERT INTO public_feedback (id, name, rating, comment, status, created_at) VALUES (${crypto.randomUUID()}, ${name}, ${rating}, ${comment}, 'pending', ${Date.now()})`;
          return Response.json(
            { ok: true, message: "Thanks. Your feedback will be reviewed before publication." },
            { status: 201 },
          );
        } catch {
          return Response.json({ error: "Feedback is temporarily unavailable" }, { status: 503 });
        }
      },
    },
  },
});

function textField(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
