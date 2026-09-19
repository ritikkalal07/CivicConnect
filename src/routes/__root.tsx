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
      { title: "CivicConnect Autonomous | Civic Intelligence" },
      {
        name: "description",
        content:
          "Autonomous civic intelligence that detects, routes, and escalates community issues.",
      },
      { property: "og:title", content: "CivicConnect Autonomous | Civic Intelligence" },
      {
        property: "og:description",
        content: "Detect civic issues, coordinate action, and keep communities informed.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://civic-con-nect.vercel.app/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "CivicConnect Autonomous | Civic Intelligence" },
      {
        name: "twitter:description",
        content: "A transparent, supervised civic issue reporting and triage platform.",
      },
      {
        name: "keywords",
        content: "civic issues, public safety, community reporting, civic intelligence, India",
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
        "A supervised civic intelligence platform for reporting community issues, sharing evidence, and triaging priority signals.",
      featureList: [
        "Civic issue reporting",
        "Location-aware map",
        "Photo evidence",
        "Offline synchronization",
        "Explainable supervised triage",
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
            text: "It is a public civic issue reporting platform that helps communities submit evidence, locate issues, and triage priority cases with explainable supervised automation.",
          },
        },
        {
          "@type": "Question",
          name: "Does CivicConnect automatically contact officials?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. The current public deployment uses supervised triage and human review. Outbound actions require separately configured, authenticated services and approval controls.",
          },
        },
        {
          "@type": "Question",
          name: "How is public feedback handled?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Feedback is stored for moderation review before it can be published, helping protect the public from spam and unsafe content.",
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
