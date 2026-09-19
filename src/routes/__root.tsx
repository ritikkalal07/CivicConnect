import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CivicConnect Autonomous: Self-Operating Civic Intelligence Platform" },
      {
        name: "description",
        content:
          "It doesn't wait for data. It finds it. It doesn't wait for orders. It acts. It doesn't wait for humans. It learns.",
      },
      { property: "og:title", content: "CivicConnect Autonomous: Self-Operating Civic Intelligence Platform" },
      {
        property: "og:description",
        content:
          "It doesn't wait for data. It finds it. It doesn't wait for orders. It acts. It doesn't wait for humans. It learns.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://civic-con-nect.vercel.app/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "CivicConnect Autonomous: Self-Operating Civic Intelligence Platform" },
      {
        name: "twitter:description",
        content:
          "Self-operating civic intelligence platform for India. Autonomous harvesters, Knowledge Graph, 9 workers, and self-learning loops.",
      },
      {
        name: "keywords",
        content:
          "civicconnect, autonomous civic intelligence, 311 india, pothole detection, automatic escalation, bhashini nmt",
      },
      { name: "theme-color", content: "#0F6B6B" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "canonical", href: "https://civic-con-nect.vercel.app/" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "CivicConnect Autonomous",
      url: "https://civic-con-nect.vercel.app/",
      applicationCategory: "CivicApplication",
      operatingSystem: "Web",
      description:
        "Self-operating civic intelligence platform that continuously watches public signals, routes issues, auto-escalates, and learns autonomously.",
      featureList: [
        "24/7 Autonomous Harvesters",
        "Self-building Knowledge Graph",
        "9 Autonomous Agents (Router, Escalator, Verifier, Detector, Anomaly, Dedup, Chatbot, Sentiment, Self-Heal)",
        "9 Autonomous Workers (Router, Escalator, Verifier, Detector, Anomaly, Dedup, Assistant, Sentiment, SelfHeal)",
        "5 Continuous Self-Learning Loops",
        "Bhashini Multilingual AI Chatbot",
        "Bhashini Multilingual Assistant",
        "Government Officer Portal & E2E Lifecycle Verification",
      ],
    },
    {
      "@type": "Organization",
      name: "CivicConnect Autonomous",
      url: "https://civic-con-nect.vercel.app/",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is CivicConnect Autonomous?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "It is a self-operating civic intelligence platform that autonomously discovers, routes, escalates, and verifies community issues 24/7 without waiting for manual human triggers.",
          },
        },
        {
          "@type": "Question",
          name: "How does the autonomous agent system work?",
          name: "How does the autonomous worker system work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "CivicConnect Autonomous uses 10 harvester scrapers, a self-building Knowledge Graph, and 9 specialized agents (Router, Escalator, Verifier, Detector, Anomaly, Dedup, Chatbot, Sentiment, Self-Heal) to act on civic issues.",
            text: "CivicConnect Autonomous uses 10 harvester scrapers, a self-building Knowledge Graph, and 9 specialized workers (Router, Escalator, Verifier, Detector, Anomaly, Dedup, Assistant, Sentiment, SelfHeal) to resolve civic issues.",
          },
        },
        {
          "@type": "Question",
          name: "What languages does the AI chatbot support?",
          name: "What languages does the assistant support?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The chatbot supports 22 Indian languages including English, Hindi, Kannada, Tamil, Telugu, Marathi, Bengali, and Bodo powered by Bhashini AI.",
            text: "The assistant supports 22 Indian languages including English, Hindi, Kannada, Tamil, Telugu, Marathi, Bengali, and Bodo powered by Bhashini NMT.",
          },
        },
      ],
    },
  ],
};

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    if ("serviceWorker" in navigator) void navigator.serviceWorker.register("/sw.js");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
