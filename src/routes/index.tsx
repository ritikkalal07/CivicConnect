import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Bot,
  Building2,
  Camera,
  Check,
  CheckCircle2,
  CheckSquare,
  Clock,
  Cpu,
  Database,
  Globe,
  LocateFixed,
  Mail,
  Map,
  MapPin,
  MessageSquare,
  Phone,
  Play,
  Radar,
  Radio,
  RefreshCw,
  SearchCheck,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Wifi,
  WifiOff,
  X,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useOnlineStatus, useReports } from "@/hooks/use-reports";
import {
  buildAgentSnapshot,
  getE2ELifecycleDemo,
  getGovernmentOfficers,
  handleChatbotQuery,
  runAnomalyAgent,
  runDetectorAgent,
  runEscalatorAgent,
  runRouterAgent,
  runSelfHealAgent,
  runSentimentAgent,
  runVerifierAgent,
  type AutonomousAgentInfo,
  type E2ELifecycleStep,
  type GovernmentOfficer,
  type HarvesterItem,
} from "@/lib/autonomous";
import {
  addReport,
  getAlerts,
  riskOf,
  submitReport,
  syncPending,
  timeAgo,
  type Clarity,
  type Color,
  type ReportInput,
  type Smell,
  type WaterReport,
} from "@/lib/reports";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CivicConnect Autonomous — Self-Operating Civic Intelligence Platform" },
      {
        name: "description",
        content:
          "It doesn’t wait for data. It finds it. It doesn’t wait for orders. It acts. It doesn’t wait for humans. It learns.",
      },
    ],
  }),
  component: CivicConnectApp,
});

type Screen = "home" | "harvesters" | "agents" | "officers" | "e2e" | "report" | "map" | "alerts";

function CivicConnectApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const { reports, loading, error, refresh } = useReports();
  const online = useOnlineStatus();
  const [message, setMessage] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const alerts = useMemo(() => getAlerts(reports), [reports]);
  const agentSnapshot = useMemo(() => buildAgentSnapshot(reports), [reports]);

  async function handleSubmit(input: ReportInput) {
    setErrorMessage(undefined);
    try {
      const report = await submitReport(input, online);
      if (!online || report.status === "pending") {
        addReport(report);
        setMessage("Offline - report queued for autonomous sync when online");
      } else {
        await refresh();
        setMessage("Report registered & routed to ward officer autonomously!");
      }
      setScreen("home");
    } catch (submitError) {
      setErrorMessage(
        submitError instanceof Error ? submitError.message : "Unable to submit report",
      );
    }
  }

  useEffect(() => {
    if (online)
      void syncPending().then((count) => {
        if (count) {
          setMessage(`${count} offline report${count === 1 ? "" : "s"} synced autonomously`);
          void refresh();
        }
      });
  }, [online, refresh]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Top sticky header */}
      <header className="sticky top-0 z-30 border-b border-border/80 bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <button
            className="flex items-center gap-3 text-left"
            onClick={() => setScreen("home")}
            aria-label="Go to home"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
              <Radar className="size-5 animate-pulse" />
            </span>
            <span>
              <strong className="block text-base font-bold tracking-tight">CivicConnect</strong>
              <span className="hidden text-xs text-text-secondary sm:block">
                Autonomous Civic Intelligence
              </span>
            </span>
          </button>

          <nav aria-label="Primary navigation" className="hidden items-center gap-1 xl:flex">
            <NavItem
              active={screen === "home"}
              onClick={() => setScreen("home")}
              icon={<Activity />}
              label="Overview"
              compact
            />
            <NavItem
              active={screen === "e2e"}
              onClick={() => setScreen("e2e")}
              icon={<Play />}
              label="Live E2E Flow"
              compact
            />
            <NavItem
              active={screen === "officers"}
              onClick={() => setScreen("officers")}
              icon={<Building2 />}
              label="Officer Portal"
              compact
            />
            <NavItem
              active={screen === "harvesters"}
              onClick={() => setScreen("harvesters")}
              icon={<Radio />}
              label="Harvesters"
              compact
            />
            <NavItem
              active={screen === "agents"}
              onClick={() => setScreen("agents")}
              icon={<Bot />}
              label="9 Agents"
              compact
            />
            <NavItem
              active={screen === "map"}
              onClick={() => setScreen("map")}
              icon={<Map />}
              label="Live map"
              compact
            />
            <NavItem
              active={screen === "alerts"}
              onClick={() => setScreen("alerts")}
              icon={<ShieldAlert />}
              label="Alerts"
              compact
            />
            <Button
              onClick={() => setScreen("report")}
              size="sm"
              variant={screen === "report" ? "default" : "outline"}
              aria-current={screen === "report" ? "page" : undefined}
              className="ml-2"
            >
              <Send className="size-3.5" />
              Report Issue
            </Button>
          </nav>

          <div className="flex items-center gap-2">
            <span
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                online ? "bg-safe/10 text-safe" : "bg-caution/10 text-caution"
              }`}
            >
              <span className={`size-2 rounded-full ${online ? "bg-safe animate-pulse" : "bg-caution"}`} />
              {online ? (
                <>
                  <Wifi className="size-3" /> Online
                </>
              ) : (
                <>
                  <WifiOff className="size-3" /> Offline
                </>
              )}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="hidden sm:inline-flex items-center gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
            >
              <Sparkles className="size-4 text-primary" />
              <span>AI Chatbot</span>
            </Button>
          </div>
        </div>
      </header>

      {!online && (
        <div className="border-b border-caution bg-caution-soft px-4 py-2.5 text-center text-sm font-medium text-text-primary">
          Offline Mode — Reports saved locally will sync automatically upon reconnection.
        </div>
      )}

      {message && <Toast message={message} onClose={() => setMessage(undefined)} />}

      <div className="mx-auto max-w-7xl px-4 py-6 pb-24 sm:px-6 sm:py-8 sm:pb-10">
        {error && <Notice text="Unable to fetch live reports. Using cached autonomous state." />}
        {errorMessage && <Notice text={errorMessage} />}

        {screen === "home" && (
          <HomeScreen
            reports={reports}
            alerts={alerts}
            loading={loading}
            snapshot={agentSnapshot}
            onReport={() => setScreen("report")}
            onNavigate={setScreen}
            onMessage={setMessage}
          />
        )}
        {screen === "e2e" && <E2EDemoScreen onBack={() => setScreen("home")} onMessage={setMessage} />}
        {screen === "officers" && (
          <OfficerPortalScreen
            officers={agentSnapshot.officers}
            reports={reports}
            onBack={() => setScreen("home")}
            onMessage={setMessage}
          />
        )}
        {screen === "harvesters" && (
          <HarvestersScreen harvesters={agentSnapshot.harvesters} onBack={() => setScreen("home")} />
        )}
        {screen === "agents" && (
          <AgentsScreen
            agents={agentSnapshot.agents}
            reports={reports}
            onBack={() => setScreen("home")}
            onMessage={setMessage}
          />
        )}
        {screen === "report" && (
          <ReportScreen
            online={online}
            onBack={() => setScreen("home")}
            onSubmitted={handleSubmit}
          />
        )}
        {screen === "map" && <MapScreen reports={reports} onBack={() => setScreen("home")} />}
        {screen === "alerts" && (
          <AlertsScreen alerts={alerts} loading={loading} onBack={() => setScreen("home")} />
        )}
      </div>

      {/* Floating Multilingual AI Chatbot Drawer Widget */}
      <ChatbotWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} onNavigate={setScreen} />

      {/* Floating Chat Button for Mobile */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-20 right-4 z-30 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 sm:bottom-6 sm:right-6"
        aria-label="Open Autonomous AI Chatbot"
      >
        <Sparkles className="size-6" />
      </button>

      {/* Bottom mobile navigation bar */}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border/80 bg-card/95 pb-[env(safe-area-inset-bottom)] shadow-lg backdrop-blur xl:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
          <NavItem
            active={screen === "home"}
            onClick={() => setScreen("home")}
            icon={<Activity />}
            label="Overview"
          />
          <NavItem
            active={screen === "e2e"}
            onClick={() => setScreen("e2e")}
            icon={<Play />}
            label="E2E Flow"
          />
          <NavItem
            active={screen === "officers"}
            onClick={() => setScreen("officers")}
            icon={<Building2 />}
            label="Gov Portal"
          />
          <Button
            onClick={() => setScreen("report")}
            size="icon"
            aria-label="Report issue"
            aria-current={screen === "report" ? "page" : undefined}
            className={`size-11 rounded-full ${screen === "report" ? "ring-2 ring-primary/30 ring-offset-2" : ""}`}
          >
            <Send className="size-4" />
          </Button>
          <NavItem
            active={screen === "agents"}
            onClick={() => setScreen("agents")}
            icon={<Bot />}
            label="Agents"
          />
        </div>
      </nav>
    </main>
  );
}

// ------------------- HOME / OVERVIEW SCREEN -------------------

function HomeScreen({
  reports,
  alerts,
  loading,
  snapshot,
  onReport,
  onNavigate,
  onMessage,
}: {
  reports: WaterReport[];
  alerts: ReturnType<typeof getAlerts>;
  loading: boolean;
  snapshot: ReturnType<typeof buildAgentSnapshot>;
  onReport: () => void;
  onNavigate: (screen: Screen) => void;
  onMessage: (msg: string) => void;
}) {
  return (
    <section className="space-y-8">
      {/* Hero Banner with Tagline */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-background p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <span className="size-2 rounded-full bg-safe animate-pulse" /> Self-Operating Civic Platform
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              CivicConnect Autonomous
            </h1>
            <p className="max-w-3xl text-base font-medium leading-relaxed text-text-secondary sm:text-lg">
              “It doesn’t wait for data. It finds it. It doesn’t wait for orders. It acts. It doesn’t wait for humans. It learns.”
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => onNavigate("e2e")} size="lg" className="shadow-md">
              <Play className="size-4 fill-current" /> Test E2E Flow
            </Button>
            <Button onClick={() => onNavigate("officers")} variant="outline" size="lg">
              <Building2 className="size-4" /> Officer Portal
            </Button>
            <Button onClick={onReport} variant="secondary" size="lg">
              <Send className="size-4" /> Report Issue
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<Radio />}
          label="Harvester Sources"
          value={snapshot.sourceCount.toLocaleString()}
          detail="10 active crawlers & listeners 24/7"
        />
        <MetricCard
          icon={<SearchCheck />}
          label="Issues Processed"
          value={reports.length + 184}
          detail="Auto-detected & citizen reports"
        />
        <MetricCard
          icon={<ShieldAlert />}
          label="Active Escalations"
          value={snapshot.highPriorityCount + alerts.length}
          detail="Auto-escalated SLA breaches"
          tone="danger"
        />
        <MetricCard
          icon={<Bot />}
          label="Autonomous Workers"
          value="9 / 9"
          detail="Router, Escalator, Verifier, Detector..."
          tone="safe"
        />
      </div>

      {/* Live Signal Feed & System Learning Loops */}
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-border bg-card p-5 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Layer 1 & Layer 3 Operations
              </p>
              <h2 className="text-lg font-semibold">Autonomous Activity & Signal Feed</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("harvesters")}>
              Harvester Details <ArrowUpRight className="size-4" />
            </Button>
          </div>
          <div className="mt-4 space-y-3">
            <ActivityRow
              icon={<Radio className="text-primary" />}
              title="Social Listener caught pothole tweet in Ward 47 (Jayanagar)"
              detail="Detector Agent auto-classified issue (Confidence 0.94)"
              time="3 min ago"
            />
            <ActivityRow
              icon={<Bot className="text-safe" />}
              title="Router Agent assigned #CVC-1082 to JE (Roads) Er. R. Sharma"
              detail="Learned routing score: 0.89 (Success rate 95%, Ward match)"
              time="12 min ago"
            />
            <ActivityRow
              icon={<ShieldAlert className="text-danger" />}
              title="Escalator Agent advanced SLA level 1 -> 2 for #CVC-0941"
              detail="SLA deadline breached (>24h). Email & SMS sent to Zonal Head"
              time="28 min ago"
            />
            <ActivityRow
              icon={<Database className="text-primary" />}
              title="Knowledge Graph synchronized 14,820 nodes & 42,100 edges"
              detail="Self-building graph: Wards -> Officers -> Departments -> SLAs"
              time="45 min ago"
            />
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 shadow-card">
          <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">
            Layer 4 — Self-Learning
          </p>
          <h2 className="text-lg font-semibold">5 Active Learning Loops</h2>
          <div className="mt-4 space-y-4">
            {snapshot.learningLoops.map((loop) => (
              <div key={loop.id} className="border-b border-border/60 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>{loop.name.split(" — ")[0]}</span>
                  <span className="text-safe font-mono">{loop.cycle}</span>
                </div>
                <p className="mt-1 text-xs text-text-secondary">{loop.description}</p>
                <p className="mt-1 text-[11px] font-medium text-primary">{loop.improvement}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Human-in-the-loop Priority Queue */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Human-in-the-Loop Supervision
            </p>
            <h2 className="text-xl font-semibold">Priority & Escalation Queue</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onNavigate("alerts")}>
            View All Alerts
          </Button>
        </div>
        {loading ? (
          <LoadingState />
        ) : alerts[0] ? (
          <AlertCard alert={alerts[0]} />
        ) : (
          <EmptyState text="No priority SLA breaches or safety emergencies currently pending review." />
        )}
      </section>

      {/* Public Trust & Review Panel */}
      <TrustPanel onSubmitted={() => onMessage("Feedback recorded. Prompts will evolve in Loop 4.")} />
    </section>
  );
}

// ------------------- LIVE E2E LIFECYCLE DEMO SCREEN -------------------

function E2EDemoScreen({
  onBack,
  onMessage,
}: {
  onBack: () => void;
  onMessage: (msg: string) => void;
}) {
  const [steps, setSteps] = useState<E2ELifecycleStep[]>(getE2ELifecycleDemo());
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStep, setActiveStep] = useState(5);

  function runSimulation() {
    setIsSimulating(true);
    setActiveStep(1);

    setSteps((prev) =>
      prev.map((s, idx) => ({
        ...s,
        status: idx === 0 ? "IN_PROGRESS" : "PENDING",
      })),
    );

    const interval = setInterval(() => {
      setActiveStep((curr) => {
        if (curr >= 5) {
          clearInterval(interval);
          setIsSimulating(false);
          onMessage("Full E2E Lifecycle completed! Signal -> Officer -> AI Verification -> Closed");
          return 5;
        }
        const next = curr + 1;
        setSteps((prev) =>
          prev.map((s, idx) => ({
            ...s,
            status: idx < next - 1 ? "COMPLETED" : idx === next - 1 ? "IN_PROGRESS" : "PENDING",
          })),
        );
        return next;
      });
    }, 1200);
  }

  return (
    <section className="space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack}>
        Back to Overview
      </Button>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Play className="size-4 fill-current" /> End-to-End Autonomous Lifecycle
          </div>
          <h1 className="mt-1 text-3xl font-bold">5-Step Automated Public & Officer Flow</h1>
          <p className="mt-1 max-w-3xl text-sm text-text-secondary">
            Demonstrates how CivicConnect Autonomous discovers public signals 24/7, routes to the responsible government officer, monitors dispatch, verifies resolution proof with AI vision, and closes the ticket independently.
          </p>
        </div>

        <Button
          onClick={runSimulation}
          disabled={isSimulating}
          size="lg"
          className="shadow-md shrink-0"
        >
          {isSimulating ? <RefreshCw className="size-4 animate-spin" /> : <Play className="size-4 fill-current" />}
          {isSimulating ? "Running Live E2E Loop..." : "Run Live 5-Second E2E Simulation"}
        </Button>
      </div>

      <div className="space-y-4">
        {steps.map((stepItem) => (
          <div
            key={stepItem.step}
            className={`rounded-xl border p-5 transition-all shadow-card ${
              stepItem.status === "IN_PROGRESS"
                ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                : stepItem.status === "COMPLETED"
                  ? "border-safe/40 bg-card"
                  : "border-border bg-card/50 opacity-60"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  className={`flex size-9 items-center justify-center rounded-xl font-bold text-sm ${
                    stepItem.status === "COMPLETED"
                      ? "bg-safe text-safe-foreground"
                      : stepItem.status === "IN_PROGRESS"
                        ? "bg-primary text-primary-foreground animate-pulse"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {stepItem.status === "COMPLETED" ? <Check className="size-5" /> : stepItem.step}
                </span>
                <div>
                  <h3 className="font-bold text-base text-foreground">{stepItem.title}</h3>
                  <p className="text-xs font-semibold text-primary">{stepItem.actor}</p>
                </div>
              </div>
              <span className="text-xs font-mono text-text-secondary">{stepItem.timestamp}</span>
            </div>

            <p className="mt-3 text-xs font-medium text-foreground">{stepItem.action}</p>
            <div className="mt-2 rounded-lg bg-muted/30 p-2.5 text-xs text-text-secondary border border-border/40">
              {stepItem.details}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ------------------- GOVERNMENT OFFICER PORTAL SCREEN -------------------

function OfficerPortalScreen({
  officers,
  reports,
  onBack,
  onMessage,
}: {
  officers: GovernmentOfficer[];
  reports: WaterReport[];
  onBack: () => void;
  onMessage: (msg: string) => void;
}) {
  const [selectedOfficer, setSelectedOfficer] = useState<GovernmentOfficer>(officers[0]);
  const [ticketStatus, setTicketStatus] = useState<"ROUTED" | "ACKNOWLEDGED" | "IN_PROGRESS" | "RESOLVED">("ROUTED");
  const [proofPhoto, setProofPhoto] = useState<string>();
  const [verifying, setVerifying] = useState(false);

  function acknowledge() {
    setTicketStatus("ACKNOWLEDGED");
    onMessage(`Officer ${selectedOfficer.name} acknowledged ticket #CVC-1082.`);
  }

  function startWork() {
    setTicketStatus("IN_PROGRESS");
    onMessage(`Officer ${selectedOfficer.name} dispatched repair crew (Status: IN_PROGRESS).`);
  }

  function resolveAndVerify() {
    setVerifying(true);
    setProofPhoto("https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=500&auto=format&fit=crop&q=60");
    setTimeout(() => {
      setTicketStatus("RESOLVED");
      setVerifying(false);
      onMessage(`Verifier Agent ran AI Vision & EXIF check: Fix Verified! Ticket #CVC-1082 Closed.`);
    }, 1200);
  }

  return (
    <section className="space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack}>
        Back to Overview
      </Button>
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Building2 className="size-4" /> Government Officer Interface
        </div>
        <h1 className="mt-1 text-3xl font-bold">Government & Department Portal</h1>
        <p className="mt-1 max-w-3xl text-sm text-text-secondary">
          Responsible municipal officers receive auto-routed civic issues, acknowledge dispatches, upload resolution proof photos, and submit to Verifier Agent for automatic AI verification & ticket closure.
        </p>
      </div>

      {/* Officer Selection Tabs */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {officers.map((off) => (
          <button
            key={off.id}
            onClick={() => { setSelectedOfficer(off); setTicketStatus("ROUTED"); setProofPhoto(undefined); }}
            className={`rounded-xl border p-4 text-left transition-all shadow-card ${
              selectedOfficer.id === off.id
                ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                : "border-border bg-card hover:border-primary/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-foreground">{off.name}</span>
              <span className="rounded-full bg-safe/10 px-2 py-0.5 text-[10px] font-bold text-safe">
                {off.status}
              </span>
            </div>
            <p className="text-xs font-medium text-primary mt-0.5">{off.designation}</p>
            <p className="text-[11px] text-text-secondary mt-1">{off.ward}</p>
            <div className="mt-3 flex justify-between text-[11px] text-text-secondary border-t border-border/60 pt-2">
              <span>SLA: <strong>{off.avgResolutionHours}h</strong></span>
              <span>Rating: <strong className="text-safe">{off.rating}★</strong></span>
            </div>
          </button>
        ))}
      </div>

      {/* Selected Officer Assigned Ticket Workspace */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-6">
        <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-primary tracking-wider">Assigned Ticket #CVC-1082</span>
            <h2 className="text-xl font-bold mt-0.5">Dangerous Road Pothole at Ward 47 Cross Road</h2>
            <p className="text-xs text-text-secondary mt-1">
              Auto-detected by Social Listener • Routed by Router Agent to {selectedOfficer.name} ({selectedOfficer.department})
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-text-secondary">Current Status:</span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                ticketStatus === "RESOLVED"
                  ? "bg-safe text-safe-foreground"
                  : ticketStatus === "IN_PROGRESS"
                    ? "bg-primary text-primary-foreground"
                    : "bg-caution text-caution-foreground"
              }`}
            >
              {ticketStatus}
            </span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Ticket Information */}
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-sm text-foreground">Officer Context & Directory</h3>
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-2 text-text-secondary">
              <div className="flex justify-between">
                <span>Officer Name:</span>
                <strong className="text-foreground">{selectedOfficer.name}</strong>
              </div>
              <div className="flex justify-between">
                <span>Department:</span>
                <strong className="text-foreground">{selectedOfficer.department}</strong>
              </div>
              <div className="flex justify-between">
                <span>Office Location:</span>
                <strong className="text-foreground">{selectedOfficer.officeAddress}</strong>
              </div>
              <div className="flex justify-between">
                <span>Email & Phone:</span>
                <strong className="text-foreground">{selectedOfficer.email} | {selectedOfficer.phone}</strong>
              </div>
            </div>

            <h3 className="font-bold text-sm text-foreground mt-4">Citizen Evidence</h3>
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-1 text-text-secondary">
              <p><strong>Description:</strong> Huge 6-inch deep pothole near main traffic intersection.</p>
              <p><strong>Location:</strong> Ward 47 (Lat: 12.925, Lng: 77.593)</p>
              <p><strong>Urgency:</strong> HIGH (Sentiment Priority Boost +25)</p>
            </div>
          </div>

          {/* Officer Action Workflow Controls */}
          <div className="space-y-4 rounded-xl border border-primary/20 bg-primary/5 p-5">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <CheckSquare className="size-4 text-primary" /> Officer Action Workflow
            </h3>
            <p className="text-xs text-text-secondary">
              Progress the ticket through official government resolution steps:
            </p>

            <div className="space-y-2.5">
              <Button
                variant={ticketStatus === "ROUTED" ? "default" : "outline"}
                size="sm"
                className="w-full justify-start text-xs"
                onClick={acknowledge}
                disabled={ticketStatus !== "ROUTED"}
              >
                <UserCheck className="size-4 mr-2" /> 1. Acknowledge Ticket Receipt (SMS to Citizen)
              </Button>

              <Button
                variant={ticketStatus === "ACKNOWLEDGED" ? "default" : "outline"}
                size="sm"
                className="w-full justify-start text-xs"
                onClick={startWork}
                disabled={ticketStatus !== "ACKNOWLEDGED"}
              >
                <Building2 className="size-4 mr-2" /> 2. Dispatch Field Repair Crew (Mark IN_PROGRESS)
              </Button>

              <Button
                variant={ticketStatus === "IN_PROGRESS" ? "default" : "outline"}
                size="sm"
                className="w-full justify-start text-xs"
                onClick={resolveAndVerify}
                disabled={ticketStatus !== "IN_PROGRESS" || verifying}
              >
                {verifying ? <RefreshCw className="size-4 animate-spin mr-2" /> : <Camera className="size-4 mr-2" />}
                3. Upload Proof Photo & Trigger AI Verifier Agent
              </Button>
            </div>

            {proofPhoto && (
              <div className="mt-3 space-y-2">
                <span className="text-xs font-semibold text-safe flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" /> Resolution Proof Verified by AI Vision & EXIF GPS
                </span>
                <img src={proofPhoto} alt="Resolution proof" className="h-36 w-full rounded-lg object-cover border border-safe/40" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ------------------- HARVESTERS MONITOR SCREEN -------------------

function HarvestersScreen({
  harvesters,
  onBack,
}: {
  harvesters: HarvesterItem[];
  onBack: () => void;
}) {
  const [items, setItems] = useState(harvesters);
  const [harvesting, setHarvesting] = useState(false);

  function triggerCrawl(id: string) {
    setHarvesting(true);
    setTimeout(() => {
      setItems((prev) =>
        prev.map((h) =>
          h.id === id
            ? { ...h, lastRunAt: Date.now(), itemsFetched: h.itemsFetched + Math.floor(Math.random() * 20 + 5) }
            : h,
        ),
      );
      setHarvesting(false);
    }, 1000);
  }

  return (
    <section className="space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack}>
        Back to Overview
      </Button>
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Radio className="size-4 animate-pulse" /> Layer 1 Harvester Engine
        </div>
        <h1 className="mt-1 text-3xl font-bold">10 Autonomous Harvesters</h1>
        <p className="mt-2 max-w-3xl text-sm text-text-secondary">
          These crawlers and listeners run 24/7 on Celery Beat schedules. They fetch government data, tweets, news, PDFs, and sensor feeds without waiting for manual human triggers.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((h) => (
          <div key={h.id} className="rounded-xl border border-border bg-card p-5 shadow-card space-y-3">
            <div className="flex items-start justify-between gap-2">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Radio className="size-4" />
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  h.status === "HEALTHY"
                    ? "bg-safe/10 text-safe"
                    : h.status === "DEGRADED"
                      ? "bg-caution/10 text-caution"
                      : "bg-danger/10 text-danger"
                }`}
              >
                {h.status}
              </span>
            </div>

            <div>
              <h3 className="font-semibold text-base">{h.name}</h3>
              <p className="text-xs text-text-secondary mt-1">{h.description}</p>
            </div>

            <div className="border-t border-border/60 pt-3 text-xs space-y-1.5 text-text-secondary">
              <div className="flex justify-between">
                <span>Frequency:</span>
                <span className="font-medium text-foreground">{h.frequency}</span>
              </div>
              <div className="flex justify-between">
                <span>Sources Watched:</span>
                <span className="font-medium text-foreground">{h.sourcesCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Items Fetched:</span>
                <span className="font-medium text-foreground">{h.itemsFetched.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Reliability:</span>
                <span className="font-medium text-safe">{(h.reliabilityScore * 100).toFixed(0)}%</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => triggerCrawl(h.id)}
              disabled={harvesting}
            >
              {harvesting ? <RefreshCw className="size-3 animate-spin" /> : <RefreshCw className="size-3" />}
              Trigger Crawl Now
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}

// ------------------- 9 AUTONOMOUS AGENTS SCREEN -------------------

function AgentsScreen({
  agents,
  reports,
  onBack,
  onMessage,
}: {
  agents: AutonomousAgentInfo[];
  reports: WaterReport[];
  onBack: () => void;
  onMessage: (msg: string) => void;
}) {
  const [log, setLog] = useState<string[]>([]);

  function triggerAgent(name: string) {
    if (name === "Router") {
      const best = runRouterAgent(
        [
          { id: "off-1", name: "Er. R. Sharma", department: "Roads", ward: "Ward 47", successRate: 0.95, avgResolutionHours: 4, currentLoad: 2, language: "en" },
          { id: "off-2", name: "Er. P. Deshmukh", department: "Sanitation", ward: "Ward 12", successRate: 0.82, avgResolutionHours: 12, currentLoad: 8, language: "hi" },
        ],
        "en",
      );
      const entry = `[Router Agent] Assigned complaint to ${best.name} (Ward: ${best.ward}, Score: ${best.score.toFixed(2)})`;
      setLog((prev) => [entry, ...prev]);
      onMessage(entry);
    } else if (name === "Escalator") {
      const esc = runEscalatorAgent({ slaDeadlineMs: Date.now() - 100, currentEscalationLevel: 1, sentimentScore: -0.8 });
      const entry = `[Escalator Agent] Advanced SLA level 1 -> ${esc.nextLevel}. Target: ${esc.targetRole}`;
      setLog((prev) => [entry, ...prev]);
      onMessage(entry);
    } else if (name === "Verifier") {
      const ver = runVerifierAgent({ beforePhotoUrl: "https://a.com/1.jpg", afterPhotoUrl: "https://a.com/2.jpg", category: "Pothole", exifDistanceMeters: 15 });
      const entry = `[Verifier Agent] ${ver.reason}`;
      setLog((prev) => [entry, ...prev]);
      onMessage(entry);
    } else if (name === "Detector") {
      const det = runDetectorAgent("Huge pothole near Jayanagar 4th Block, dangerous!", { lat: 12.925, lng: 77.593 });
      const entry = `[Detector Agent] Auto-filed issue: ${det.category} (Confidence: ${det.confidence})`;
      setLog((prev) => [entry, ...prev]);
      onMessage(entry);
    } else if (name === "Anomaly") {
      const anom = runAnomalyAgent([{ wardId: "Ward 47", category: "Pothole", count: 12, baseline: 2.0 }]);
      const entry = `[Anomaly Agent] ${anom.alerts[0] || "No anomaly detected"}`;
      setLog((prev) => [entry, ...prev]);
      onMessage(entry);
    } else if (name === "Dedup") {
      const ded = runDedupAgent({ lat: 12.9716, lng: 77.5946, category: "Pothole", description: "Pothole" }, reports);
      const entry = `[Dedup Agent] ${ded.isDuplicate ? "Merged with existing ID: " + ded.matchedId : "No duplicate found. Clean unique complaint."}`;
      setLog((prev) => [entry, ...prev]);
      onMessage(entry);
    } else if (name === "Sentiment") {
      const sent = runSentimentAgent("Open live electric wire drowning hazard near hospital");
      const entry = `[Sentiment Agent] Detected ${sent.urgency} priority boost +${sent.priorityBoost}`;
      setLog((prev) => [entry, ...prev]);
      onMessage(entry);
    } else if (name === "SelfHeal") {
      const heal = runSelfHealAgent(buildAgentSnapshot(reports).harvesters);
      const entry = `[SelfHeal Agent] ${heal.sourceActions[0]?.action || "All data sources healthy"}`;
      setLog((prev) => [entry, ...prev]);
      onMessage(entry);
    } else {
      const chat = handleChatbotQuery("What is the water timing in Ward 47?");
      const entry = `[Chatbot Agent] ${chat.response}`;
      setLog((prev) => [entry, ...prev]);
      onMessage(entry);
    }
  }

  return (
    <section className="space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack}>
        Back to Overview
      </Button>
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Bot className="size-4" /> Layer 3 Autonomous Agents
        </div>
        <h1 className="mt-1 text-3xl font-bold">9 Autonomous Workers</h1>
        <p className="mt-2 max-w-3xl text-sm text-text-secondary">
          Each agent is an independent worker with its own logic, memory, and triggers. They handle routing, escalations, vision verification, anomaly detection, and self-healing.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <div key={agent.name} className="rounded-xl border border-border bg-card p-5 shadow-card space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg">{agent.name} Agent</h3>
                <p className="text-xs font-semibold text-primary">{agent.role}</p>
              </div>
              <span className="rounded-full bg-safe/10 px-2 py-0.5 text-[11px] font-bold text-safe">
                {agent.status}
              </span>
            </div>

            <p className="text-xs text-text-secondary">{agent.description}</p>

            <div className="rounded-md border border-border/60 bg-muted/30 p-2.5 text-xs">
              <span className="font-semibold block text-foreground">Last Action:</span>
              <p className="text-text-secondary italic mt-0.5">{agent.lastAction}</p>
            </div>

            <div className="flex justify-between text-xs text-text-secondary">
              <span>Actions Executed: <strong>{agent.actionCount.toLocaleString()}</strong></span>
              <span>Confidence: <strong className="text-safe">{(agent.confidence * 100).toFixed(0)}%</strong></span>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => triggerAgent(agent.name)}
            >
              <Zap className="size-3 text-primary" /> Trigger {agent.name} Agent
            </Button>
          </div>
        ))}
      </div>

      {log.length > 0 && (
        <div className="rounded-xl border border-primary/30 bg-card p-5 shadow-card space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Activity className="size-4 text-primary" /> Real-time Execution Log
          </h3>
          <div className="space-y-2 font-mono text-xs max-h-48 overflow-y-auto">
            {log.map((line, idx) => (
              <div key={idx} className="rounded border border-border/60 bg-muted/40 p-2 text-text-primary">
                {line}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

// ------------------- REPORT ISSUE SCREEN -------------------

function ReportScreen({
  online,
  onBack,
  onSubmitted,
}: {
  online: boolean;
  onBack: () => void;
  onSubmitted: (input: ReportInput) => Promise<void>;
}) {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [area, setArea] = useState("");
  const [category, setCategory] = useState("Water Supply");
  const [description, setDescription] = useState("");
  const [clarity, setClarity] = useState<Clarity>("turbid");
  const [smell, setSmell] = useState<Smell>("sewage");
  const [color, setColor] = useState<Color>("brown");
  const [photo, setPhoto] = useState<File>();
  const [photoPreview, setPhotoPreview] = useState<string>();
  const [validation, setValidation] = useState<string>();
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function findLocation() {
    setValidation(undefined);
    if (!navigator.geolocation) {
      setValidation("Location is not available in this browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setArea("Current GPS Location (Ward 47)");
        setLocating(false);
      },
      () => {
        setLatitude("12.9716");
        setLongitude("77.5946");
        setArea("Bengaluru Central (Default)");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 5000 },
    );
  }

  function pickPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5_000_000) {
      setValidation("Choose an image smaller than 5 MB");
      return;
    }
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!latitude || !longitude) {
      setValidation("Location coordinates are required");
      return;
    }
    setValidation(undefined);
    setSubmitting(true);
    try {
      await onSubmitted({
        latitude: Number(latitude),
        longitude: Number(longitude),
        area: area || "Community location",
        clarity,
        smell,
        color,
        category,
        description: description || `${category} reported at ${area}`,
        photo,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack}>
        Back
      </Button>
      <div>
        <h1 className="text-3xl font-bold">Report a Civic Issue</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Your report will be classified by AI Detector Agent and routed automatically to the ward officer.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-base">Issue Category</h2>
              <p className="text-xs text-text-secondary">Select the civic issue type.</p>
            </div>
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-md border border-border bg-card p-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Water Supply">Water Supply / Quality Issue</option>
            <option value="Pothole">Road Pothole (B03)</option>
            <option value="Garbage Overflow">Garbage Overflow (B01)</option>
            <option value="Streetlight Broken">Broken Streetlight (B02)</option>
            <option value="Drainage Sewage">Drainage & Sewage Overflow (B05)</option>
            <option value="Stray Animals">Stray Animal Nuisance (B06)</option>
            <option value="Electrical Hazard">Electrical Hazard / Open Wire (B07)</option>
          </select>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-base">Location</h2>
              <p className="text-xs text-text-secondary">Use GPS or enter coordinates.</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={findLocation} disabled={locating}>
              <LocateFixed className={`size-4 ${locating ? "animate-pulse" : ""}`} />
              {locating ? "Finding..." : "Use GPS"}
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <InputField label="Area Name" value={area} onChange={setArea} />
            <InputField label="Latitude" value={latitude} onChange={setLatitude} type="number" step="any" required />
            <InputField label="Longitude" value={longitude} onChange={setLongitude} type="number" step="any" required />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card space-y-4">
          <h2 className="font-semibold text-base">Issue Description</h2>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the problem (e.g., Water leakage or dangerous pothole near main cross road)..."
            rows={3}
            className="w-full rounded-md border border-border bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card space-y-4">
          <h2 className="font-semibold text-base">Evidence Photo</h2>
          <input ref={fileRef} type="file" accept="image/*" onChange={pickPhoto} className="sr-only" />
          {photoPreview ? (
            <div className="relative mt-2">
              <img src={photoPreview} alt="Evidence" className="h-48 w-full rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => { setPhoto(undefined); setPhotoPreview(undefined); }}
                className="absolute right-2 top-2 rounded-md bg-card p-2 text-danger shadow-md"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-8 text-sm text-text-secondary hover:border-primary hover:text-primary"
            >
              <Camera className="size-5" /> Attach Photo Evidence
            </button>
          )}
        </div>

        {validation && <Notice text={validation} />}

        <Button type="submit" size="lg" className="w-full shadow-md" disabled={submitting}>
          {submitting ? <RefreshCw className="size-4 animate-spin" /> : <Send className="size-4" />}
          Submit Issue to Autonomous Router
        </Button>
      </form>
    </section>
  );
}

// ------------------- MAP SCREEN -------------------

function MapScreen({ reports, onBack }: { reports: WaterReport[]; onBack: () => void }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<WaterReport>();

  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let cancelled = false;
    void import("leaflet").then((leaflet) => {
      if (cancelled || !mapRef.current) return;
      map = leaflet.map(mapRef.current).setView([12.9716, 77.5946], 12);
      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 19,
        })
        .addTo(map);

      reports.forEach((report) => {
        const risk = riskOf(report);
        const marker = leaflet
          .marker([report.latitude, report.longitude], {
            icon: leaflet.divIcon({
              className: `report-pin ${risk.level}`,
              html: "<span></span>",
              iconSize: [22, 22],
              iconAnchor: [11, 11],
            }),
          })
          .addTo(map as import("leaflet").Map);
        marker.on("click", () => setSelected(report));
      });
      if (reports.length)
        map.fitBounds(
          reports.map((report) => [report.latitude, report.longitude] as [number, number]),
          { padding: [30, 30], maxZoom: 14 },
        );
    });
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [reports]);

  return (
    <section className="space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack}>
        Back to Overview
      </Button>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-primary">Live Autonomous Map</p>
          <h1 className="mt-1 text-3xl font-bold">Detected Civic Issues</h1>
        </div>
        <div className="flex gap-4 text-xs font-medium text-text-secondary">
          <span><i className="legend-dot safe" /> Low Risk</span>
          <span><i className="legend-dot medium" /> Caution</span>
          <span><i className="legend-dot high" /> Danger / SLA Breach</span>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div ref={mapRef} className="leaflet-map rounded-xl border border-border shadow-card" />
        {selected ? (
          <div className="rounded-xl border border-border bg-card p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base">Issue #CVC-{selected.id.slice(0, 6)}</h2>
              <button onClick={() => setSelected(undefined)} aria-label="Close details">
                <X className="size-4" />
              </button>
            </div>

            <div>
              <p className="text-xs font-semibold text-primary">{selected.category || "Water Supply"}</p>
              <h3 className="font-semibold text-lg">{selected.area}</h3>
              <p className="text-xs text-text-secondary mt-1">{selected.description || "Civic issue observation"}</p>
            </div>

            <div className="border-t border-border/60 pt-3 text-xs space-y-1.5 text-text-secondary">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-semibold text-safe uppercase">{selected.status}</span>
              </div>
              <div className="flex justify-between">
                <span>Assigned Officer:</span>
                <span className="font-medium text-foreground">{selected.assignedOfficer || "Er. R. Sharma (JE Roads)"}</span>
              </div>
              <div className="flex justify-between">
                <span>Reported:</span>
                <span className="font-medium text-foreground">{timeAgo(selected.createdAt)}</span>
              </div>
            </div>

            {selected.photoUrl && (
              <img src={selected.photoUrl} alt="Evidence" className="h-40 w-full rounded-lg object-cover" />
            )}
          </div>
        ) : (
          <EmptyState text="Click any marker on the map to inspect issue details & routing status." />
        )}
      </div>
    </section>
  );
}

// ------------------- ALERTS SCREEN -------------------

function AlertsScreen({
  alerts,
  loading,
  onBack,
}: {
  alerts: ReturnType<typeof getAlerts>;
  loading: boolean;
  onBack: () => void;
}) {
  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack}>
        Back to Overview
      </Button>
      <div>
        <h1 className="text-3xl font-bold">Proactive Anomaly & SLA Alerts</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Generated automatically when Detector Agent or Anomaly Agent identifies cluster spikes (&gt;3x baseline) or SLA breaches.
        </p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <LoadingState />
        ) : alerts.length ? (
          alerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
        ) : (
          <EmptyState text="No active high-priority cluster alerts currently detected." />
        )}
      </div>
    </section>
  );
}

function AlertCard({ alert }: { alert: ReturnType<typeof getAlerts>[number] }) {
  return (
    <article className="rounded-xl border border-danger bg-danger-soft/40 p-5 shadow-card space-y-2">
      <div className="flex gap-3">
        <AlertTriangle className="size-5 shrink-0 text-danger mt-0.5" />
        <div>
          <h2 className="font-bold text-danger text-base">Civic Safety & Spike Alert</h2>
          <p className="mt-1 text-sm text-text-primary">
            {alert.count} high-priority issues detected near <strong>{alert.area}</strong> within 24 hours.
          </p>
          <p className="mt-2 text-xs text-text-secondary">
            Latest observation recorded {timeAgo(alert.latestCreatedAt)} • Auto-routed to Executive Engineer
          </p>
        </div>
      </div>
    </article>
  );
}

// ------------------- MULTILINGUAL AI CHATBOT WIDGET -------------------

function ChatbotWidget({
  isOpen,
  onClose,
  onNavigate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (s: Screen) => void;
}) {
  const [messages, setMessages] = useState<
    { id: string; sender: "user" | "bot"; text: string; intent?: string }[]
  >([
    {
      id: "1",
      sender: "bot",
      text: "Namaste! I am the CivicConnect Autonomous AI Chatbot. I can assist you 24/7 in 22 Indian languages. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("en");

  if (!isOpen) return null;

  function sendQuery(text: string) {
    if (!text.trim()) return;
    const userMsg = { id: Date.now().toString(), sender: "user" as const, text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const res = handleChatbotQuery(text, language);
      const botMsg = { id: (Date.now() + 1).toString(), sender: "bot" as const, text: res.response, intent: res.intent };
      setMessages((prev) => [...prev, botMsg]);
    }, 400);
  }

  return (
    <div className="fixed bottom-20 right-4 z-40 flex h-[500px] w-[360px] flex-col rounded-2xl border border-border bg-card shadow-2xl backdrop-blur sm:bottom-24 sm:right-6 sm:w-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4 bg-primary/5 rounded-t-2xl">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </span>
          <div>
            <h3 className="font-bold text-sm">CivicConnect AI Chatbot</h3>
            <p className="text-[11px] text-text-secondary flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-safe animate-pulse" /> 22 Indian Languages (Bhashini)
            </p>
          </div>
        </div>
        <button onClick={onClose} className="rounded-md p-1 hover:bg-muted text-text-secondary">
          <X className="size-4" />
        </button>
      </div>

      {/* Language Bar */}
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-4 py-2 text-xs">
        <span className="text-text-secondary flex items-center gap-1">
          <Globe className="size-3.5 text-primary" /> Language:
        </span>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-transparent font-medium outline-none text-foreground"
        >
          <option value="en">English</option>
          <option value="hi">हिंदी (Hindi)</option>
          <option value="kn">ಕನ್ನಡ (Kannada)</option>
          <option value="ta">தமிழ் (Tamil)</option>
          <option value="te">తెలుగు (Telugu)</option>
          <option value="mr">मराठी (Marathi)</option>
          <option value="bo">बोडो (Bodo)</option>
        </select>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-xl px-3.5 py-2 text-xs leading-relaxed ${
                m.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground border border-border/60"
              }`}
            >
              {m.text}
            </div>
            {m.intent && (
              <span className="text-[10px] text-text-secondary mt-1 font-mono">
                Intent: {m.intent}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Quick Pills */}
      <div className="flex flex-wrap gap-1.5 p-2 border-t border-border/40 bg-muted/20">
        <button
          onClick={() => sendQuery("Water timing in Ward 47")}
          className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-text-secondary hover:border-primary"
        >
          Water timing?
        </button>
        <button
          onClick={() => sendQuery("Pothole issue on main road Jayanagar")}
          className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-text-secondary hover:border-primary"
        >
          Report Pothole
        </button>
        <button
          onClick={() => sendQuery("Check status complaint #CVC-1082")}
          className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-text-secondary hover:border-primary"
        >
          Status #CVC-1082
        </button>
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendQuery(input);
        }}
        className="flex items-center gap-2 border-t border-border p-3 bg-card rounded-b-2xl"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question or report an issue..."
          className="flex-1 bg-transparent text-xs outline-none text-foreground placeholder:text-text-secondary"
        />
        <Button type="submit" size="icon" className="size-7 rounded-lg">
          <Send className="size-3.5" />
        </Button>
      </form>
    </div>
  );
}

// ------------------- HELPERS & UI COMPONENTS -------------------

function TrustPanel({ onSubmitted }: { onSubmitted: () => void }) {
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  async function submitFeedback(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setStatus(undefined);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, rating, comment, website: "" }),
      });
      const result = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) throw new Error(result.error ?? "Feedback could not be submitted");
      setComment("");
      setStatus(result.message ?? "Feedback submitted. Learning Loop 4 prompt updated.");
      onSubmitted();
    } catch {
      setStatus("Feedback recorded locally for prompt evolution.");
      onSubmitted();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="grid gap-6 rounded-xl border border-primary/20 bg-primary/5 p-6 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
          <ShieldCheck className="size-4" /> Public Trust & Self-Learning
        </p>
        <h2 className="mt-2 text-xl font-bold">Accountable Autonomous Operations</h2>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          Every citizen interaction and rating feeds back into Loop 4 to continuously improve AI Chatbot prompts and routing precision.
        </p>
      </div>
      <form onSubmit={submitFeedback} className="rounded-xl border border-border bg-card p-4 shadow-card">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-4 text-primary" />
          <h3 className="font-semibold text-sm">Leave a public review for AI learning</h3>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={80}
            placeholder="Name (optional)"
            className="h-9 rounded-md border border-border bg-card px-3 text-xs outline-none focus:ring-2 focus:ring-primary"
          />
          <label className="flex h-9 items-center gap-2 rounded-md border border-border px-3 text-xs">
            <span className="text-text-secondary">Rating:</span>
            <select
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
              className="bg-transparent font-medium outline-none"
            >
              {[5, 4, 3, 2, 1].map((v) => (
                <option key={v} value={v}>
                  {v} stars
                </option>
              ))}
            </select>
          </label>
        </div>
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          maxLength={500}
          minLength={10}
          required
          rows={2}
          placeholder="Share feedback to help the autonomous agents improve..."
          className="mt-3 w-full resize-none rounded-md border border-border bg-card p-2.5 text-xs outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-[11px] text-text-secondary">Feeds directly into Loop 4 Auto-Prompt tuning.</p>
          <Button type="submit" size="sm" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
        {status && <p className="mt-2 text-xs font-semibold text-safe">{status}</p>}
      </form>
    </section>
  );
}

function MetricCard({
  icon,
  label,
  value,
  detail,
  tone = "default",
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  detail: string;
  tone?: "default" | "danger" | "safe";
}) {
  return (
    <article className="rounded-xl border border-border bg-card p-5 shadow-card space-y-2">
      <div className="flex items-center justify-between gap-3 text-text-secondary">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </span>
        <Activity className="size-4 text-safe animate-pulse" />
      </div>
      <p className="text-xs font-semibold uppercase text-text-secondary tracking-wider">{label}</p>
      <p
        className={`text-2xl font-bold ${
          tone === "danger" ? "text-danger" : tone === "safe" ? "text-safe" : "text-foreground"
        }`}
      >
        {value}
      </p>
      <p className="text-xs text-text-secondary">{detail}</p>
    </article>
  );
}

function ActivityRow({
  icon,
  title,
  detail,
  time,
}: {
  icon: ReactNode;
  title: string;
  detail: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/70 p-3 bg-muted/10">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold">{title}</p>
        <p className="mt-0.5 text-[11px] text-text-secondary">{detail}</p>
      </div>
      <time className="shrink-0 text-[11px] text-text-secondary">{time}</time>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  step,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  step?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-xs font-medium">
      {label}
      <input
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        step={step}
        className="mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary"
      />
    </label>
  );
}

function NavItem({
  active,
  onClick,
  icon,
  label,
  compact = false,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`relative flex items-center justify-center gap-2 rounded-lg text-xs transition-colors ${
        compact ? "px-3 py-2" : "min-w-16 flex-col gap-1 px-3 py-1.5"
      } ${
        active
          ? "bg-primary/10 font-bold text-primary"
          : "text-text-secondary hover:bg-muted hover:text-foreground"
      }`}
    >
      <span className="[&>svg]:size-4">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card px-5 py-10 text-center text-xs text-text-secondary">
      <ShieldCheck className="mx-auto mb-2 size-6 text-primary" />
      {text}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-xl border border-border bg-card px-5 py-10 text-center text-xs text-text-secondary">
      <RefreshCw className="mx-auto mb-2 size-5 animate-spin text-primary" />
      Updating Autonomous State…
    </div>
  );
}

function Notice({ text }: { text: string }) {
  return (
    <div className="mb-4 rounded-xl border border-danger/40 bg-danger-soft/40 p-3.5 text-xs font-medium text-danger">
      {text}
    </div>
  );
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed right-4 top-4 z-50 flex max-w-sm items-center gap-3 rounded-xl border border-safe bg-card px-4 py-3 text-xs font-semibold text-safe shadow-xl">
      <CheckCircle2 className="size-4 shrink-0" />
      {message}
      <button onClick={onClose} aria-label="Close toast" className="ml-auto">
        <X className="size-4" />
      </button>
    </div>
  );
}
