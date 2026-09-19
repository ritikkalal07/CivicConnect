import { useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  Check,
  ChevronRight,
  CircleUserRound,
  CloudOff,
  Droplets,
  Gauge,
  LocateFixed,
  Map,
  MapPin,
  Menu,
  Navigation,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  Wifi,
  WifiOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useOnlineStatus, useReports } from "@/hooks/use-reports";
import { addReport, riskOf, timeAgo, type Clarity, type Smell } from "@/lib/reports";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JalDarpan — Community Water Safety" },
      { name: "description", content: "Report water quality issues, find local alerts, and keep your community safe." },
      { property: "og:title", content: "JalDarpan — Community Water Safety" },
      { property: "og:description", content: "A simple way for communities to report and track water safety." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WaterSafetyApp,
});

type Screen = "home" | "report" | "map" | "alerts";

function WaterSafetyApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const { reports } = useReports();
  const online = useOnlineStatus();
  const [toast, setToast] = useState<string | null>(null);
  const pending = reports.filter((report) => report.status === "pending").length;
  const highRisk = reports.filter((report) => riskOf(report).level === "high").length;

  function openReport() {
    setScreen("report");
    setToast(null);
  }

  function handleSubmitted(message: string) {
    setToast(message);
    setScreen("home");
    window.setTimeout(() => setToast(null), 5000);
  }

  return (
    <main className="water-shell min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-[1180px] flex-col lg:border-x lg:border-border lg:bg-background/40">
        <header className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-8">
          <button className="flex items-center gap-2.5 text-left" onClick={() => setScreen("home")} aria-label="Go to home">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/10">
              <Droplets className="size-5" strokeWidth={2.5} />
            </span>
            <span>
              <span className="block font-semibold tracking-tight">JalDarpan</span>
              <span className="block text-[10px] font-medium uppercase tracking-[0.19em] text-muted-foreground">Community water watch</span>
            </span>
          </button>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-medium ${online ? "border-safe/30 bg-safe/10 text-safe" : "border-caution/30 bg-caution/10 text-caution"}`}>
              {online ? <Wifi className="size-3.5" /> : <WifiOff className="size-3.5" />}
              <span>{online ? "Online" : "Offline"}</span>
            </div>
            <Button variant="ghost" size="icon" aria-label="Open menu" className="text-muted-foreground">
              <Menu />
            </Button>
          </div>
        </header>

        {pending > 0 && <OfflineBanner count={pending} online={online} />}
        {toast && <Toast message={toast} />}

        <div className="flex-1">
          {screen === "home" && <HomeScreen reports={reports} highRisk={highRisk} onReport={openReport} onNavigate={setScreen} />}
          {screen === "report" && <ReportScreen online={online} onBack={() => setScreen("home")} onSubmitted={handleSubmitted} />}
          {screen === "map" && <MapScreen reports={reports} onBack={() => setScreen("home")} />}
          {screen === "alerts" && <AlertsScreen reports={reports} onBack={() => setScreen("home")} />}
        </div>

        <BottomNav screen={screen} onNavigate={setScreen} />
      </div>
    </main>
  );
}

function HomeScreen({ reports, highRisk, onReport, onNavigate }: { reports: ReturnType<typeof import("@/hooks/use-reports").useReports>["reports"]; highRisk: number; onReport: () => void; onNavigate: (screen: Screen) => void }) {
  const latest = reports[0];
  return (
    <div className="float-in px-5 pb-28 pt-8 sm:px-8 sm:pt-12">
      <div className="mx-auto max-w-4xl">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_330px]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
              <Sparkles className="size-3.5" /> Keep your neighbourhood informed
            </div>
            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.06] tracking-tight sm:text-6xl">Know your water.<br /><span className="text-primary">Protect your people.</span></h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">JalDarpan helps neighbours spot unsafe water early — one simple report at a time.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button onClick={onReport} size="lg" className="h-12 rounded-xl px-6 font-semibold shadow-xl shadow-primary/10">
                <Droplets className="size-5" /> Report water
              </Button>
              <Button onClick={() => onNavigate("map")} variant="outline" size="lg" className="h-12 rounded-xl border-border px-6">
                <Map className="size-5" /> View safety map
              </Button>
            </div>
          </div>
          <div className="relative hidden h-[274px] overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-float)] lg:block">
            <MiniMap reports={reports} />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl border border-border/80 bg-background/90 p-3 backdrop-blur">
              <div><p className="text-xs text-muted-foreground">Neighbourhood watch</p><p className="mt-0.5 font-semibold">{reports.length} reports nearby</p></div>
              <span className="flex size-8 items-center justify-center rounded-full bg-danger/15 text-danger"><MapPin className="size-4" /></span>
            </div>
          </div>
        </div>

        <section className="mt-12 grid gap-3 sm:grid-cols-3">
          <Stat icon={<ShieldCheck />} value={reports.length.toString()} label="Community reports" tone="safe" />
          <Stat icon={<AlertTriangle />} value={highRisk.toString()} label="High-risk alerts" tone="danger" />
          <Stat icon={<Gauge />} value="24h" label="Average response" tone="caution" />
        </section>

        <section className="mt-12">
          <div className="mb-4 flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Live pulse</p><h2 className="mt-1 text-xl font-semibold">Latest from your area</h2></div><Button variant="ghost" size="sm" className="text-primary" onClick={() => onNavigate("alerts")}>See all <ChevronRight className="size-4" /></Button></div>
          {latest ? <AlertCard report={latest} compact /> : <EmptyState />}
        </section>

        <section className="mt-4 rounded-2xl border border-border bg-card p-4 sm:p-5">
          <div className="flex items-start gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"><LocateFixed className="size-4" /></span><div><p className="font-medium">Your reports make a difference</p><p className="mt-1 text-sm leading-6 text-muted-foreground">Every observation helps your local team respond faster and keeps families safer.</p></div></div>
        </section>
      </div>
    </div>
  );
}

function ReportScreen({ online, onBack, onSubmitted }: { online: boolean; onBack: () => void; onSubmitted: (message: string) => void }) {
  const [clarity, setClarity] = useState<Clarity | "">("");
  const [smell, setSmell] = useState<Smell | "">("");
  const [location, setLocation] = useState("Finding your location…");
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState<string>();
  const fileRef = useRef<HTMLInputElement>(null);
  const ready = clarity && smell;

  function findLocation() {
    setLocation("Kalyani Ward 6 · GPS located");
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(() => setLocation("Kalyani Ward 6 · GPS located"), () => undefined);
  }

  useState(() => { findLocation(); return undefined; });

  function submit() {
    if (!ready) return;
    addReport({ area: "Kalyani Ward 6", lat: 22.98, lng: 88.43, clarity, smell, note: note || "Community water observation.", photo });
    onSubmitted(online ? "Report submitted · thank you for keeping watch" : "Saved offline · will sync when you’re back online");
  }

  function pickPhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => setPhoto(typeof reader.result === "string" ? reader.result : undefined));
    reader.readAsDataURL(file);
  }

  return (
    <div className="float-in px-5 pb-28 pt-5 sm:px-8 sm:pt-8">
      <div className="mx-auto max-w-2xl">
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-6 -ml-2 text-muted-foreground"><ArrowLeft className="size-4" /> Back</Button>
        <div className="mb-8"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">New observation</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Report water quality</h1><p className="mt-3 leading-6 text-muted-foreground">A quick check can help your neighbours act before it becomes a bigger problem.</p></div>
        <div className="space-y-7">
          <FieldLabel label="Where is the water?" hint="Location is added automatically"><div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"><LocateFixed className="size-5 shrink-0 text-primary" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{location}</p><p className="text-xs text-muted-foreground">Approximate location only</p></div><Button type="button" variant="ghost" size="sm" onClick={findLocation} className="text-primary">Refresh</Button></div></FieldLabel>
          <FieldLabel label="How clear is it?" hint="Choose one"><div className="grid grid-cols-3 gap-2">{(["clear", "cloudy", "turbid"] as Clarity[]).map((item) => <Choice key={item} selected={clarity === item} onClick={() => setClarity(item)} label={item} icon={item === "clear" ? "◌" : item === "cloudy" ? "◒" : "◉"} />)}</div></FieldLabel>
          <FieldLabel label="Does it smell unusual?" hint="Choose one"><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{(["none", "earthy", "sewage", "chemical"] as Smell[]).map((item) => <Choice key={item} selected={smell === item} onClick={() => setSmell(item)} label={item} />)}</div></FieldLabel>
          <FieldLabel label="Add a photo" hint="Optional"><input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={pickPhoto} className="hidden" />{photo ? <div className="relative overflow-hidden rounded-xl border border-border bg-card"><img src={photo} alt="Water sample" className="h-48 w-full object-cover" /><Button type="button" size="sm" variant="secondary" onClick={() => setPhoto(undefined)} className="absolute right-3 top-3">Remove</Button></div> : <button type="button" onClick={() => fileRef.current?.click()} className="flex w-full items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card px-4 py-7 text-sm text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"><span className="flex size-10 items-center justify-center rounded-full bg-accent text-primary"><Camera className="size-5" /></span><span><span className="block font-medium text-foreground">Take a photo or choose one</span><span className="mt-1 block text-xs">A clear photo helps verify the report</span></span></button>}</FieldLabel>
          <FieldLabel label="Anything else?" hint="Optional"><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Tell us what you noticed…" rows={3} className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary" /></FieldLabel>
          <div className="border-t border-border pt-5"><div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground"><span className={`size-2 rounded-full ${online ? "bg-safe" : "bg-caution"}`} />{online ? "Your report will be shared now" : "You’re offline — your report will be saved on this phone"}</div><Button onClick={submit} disabled={!ready} size="lg" className="h-12 w-full rounded-xl font-semibold"><Send className="size-4" /> Submit report</Button></div>
        </div>
      </div>
    </div>
  );
}

function MapScreen({ reports, onBack }: { reports: ReturnType<typeof import("@/hooks/use-reports").useReports>["reports"]; onBack: () => void }) {
  const [selected, setSelected] = useState(reports[0]?.id);
  const active = reports.find((report) => report.id === selected) ?? reports[0];
  return <div className="float-in px-5 pb-28 pt-5 sm:px-8 sm:pt-8"><div className="mx-auto max-w-5xl"><Button variant="ghost" size="sm" onClick={onBack} className="mb-5 -ml-2 text-muted-foreground"><ArrowLeft className="size-4" /> Home</Button><div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Neighbourhood view</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Water safety map</h1></div><div className="hidden text-right sm:block"><p className="text-2xl font-semibold">{reports.length}</p><p className="text-xs text-muted-foreground">observations</p></div></div><div className="grid gap-5 lg:grid-cols-[1.4fr_0.6fr]"><div className="map-grid relative min-h-[430px] overflow-hidden rounded-2xl border border-border"><div className="absolute left-[16%] top-[23%] h-[2px] w-[70%] rotate-[20deg] bg-primary/25" /><div className="absolute left-[4%] top-[61%] h-[2px] w-[92%] rotate-[-11deg] bg-primary/20" />{reports.map((report, index) => { const point = [{ left: "25%", top: "32%" }, { left: "55%", top: "54%" }, { left: "74%", top: "27%" }, { left: "40%", top: "73%" }][index % 4]; const high = riskOf(report).level === "high"; return <button key={report.id} onClick={() => setSelected(report.id)} aria-label={`View report from ${report.area}`} className={`pin-pulse absolute flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-background ${high ? "bg-danger text-danger-foreground" : "bg-caution text-caution-foreground"} ${selected === report.id ? "z-10 scale-125" : ""}`} style={point}><MapPin className="size-5" fill="currentColor" /></button>; })}<div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-xl border border-border/60 bg-background/85 px-3 py-2 text-xs backdrop-blur"><span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-danger" /> High risk</span><span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-caution" /> Caution</span></div><div className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-xl border border-border/60 bg-background/85 text-primary backdrop-blur"><Navigation className="size-4" /></div></div><div className="min-w-0">{active ? <AlertCard report={active} /> : <EmptyState />}{reports.length > 1 && <div className="mt-4 space-y-2">{reports.slice(0, 4).map((report) => <button key={report.id} onClick={() => setSelected(report.id)} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${selected === report.id ? "border-primary/50 bg-primary/10" : "border-border bg-card"}`}><span className={`flex size-8 shrink-0 items-center justify-center rounded-full ${riskOf(report).level === "high" ? "bg-danger/15 text-danger" : "bg-caution/15 text-caution"}`}><MapPin className="size-4" /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{report.area}</span><span className="block text-xs text-muted-foreground">{timeAgo(report.createdAt)}</span></span><ChevronRight className="size-4 text-muted-foreground" /></button>)}</div>}</div></div></div></div>;
}

function AlertsScreen({ reports, onBack }: { reports: ReturnType<typeof import("@/hooks/use-reports").useReports>["reports"]; onBack: () => void }) {
  return <div className="float-in px-5 pb-28 pt-5 sm:px-8 sm:pt-8"><div className="mx-auto max-w-3xl"><Button variant="ghost" size="sm" onClick={onBack} className="mb-5 -ml-2 text-muted-foreground"><ArrowLeft className="size-4" /> Home</Button><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Stay informed</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Water safety alerts</h1><p className="mt-3 text-muted-foreground">Recent observations from people near you.</p><div className="mt-8 space-y-3">{reports.map((report) => <AlertCard key={report.id} report={report} />)}</div></div></div>;
}

function AlertCard({ report, compact = false }: { report: ReturnType<typeof import("@/hooks/use-reports").useReports>["reports"][number]; compact?: boolean }) {
  const risk = riskOf(report);
  return <article className={`rounded-2xl border border-border bg-card p-4 sm:p-5 ${compact ? "" : "shadow-sm"}`}><div className="flex items-start gap-3"><span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${risk.level === "high" ? "bg-danger/15 text-danger" : risk.level === "medium" ? "bg-caution/15 text-caution" : "bg-safe/15 text-safe"}`}>{risk.level === "high" ? <AlertTriangle className="size-5" /> : <ShieldCheck className="size-5" />}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-semibold">{risk.level === "high" ? "Water Safety Alert" : "Water observation"} in {report.area}</h3><span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${risk.level === "high" ? "bg-danger/15 text-danger" : risk.level === "medium" ? "bg-caution/15 text-caution" : "bg-safe/15 text-safe"}`}>{risk.label}</span></div><p className="mt-1 text-xs text-muted-foreground">{timeAgo(report.createdAt)} · {report.status === "pending" ? "Waiting to sync" : "Community reported"}</p><p className="mt-3 text-sm leading-6 text-muted-foreground">{report.note}</p><div className="mt-3 flex flex-wrap gap-2"><Tag label={report.clarity} /><Tag label={`${report.smell} smell`} />{report.photo && <Tag label="Photo attached" />}</div></div></div></article>;
}

function MiniMap({ reports }: { reports: ReturnType<typeof import("@/hooks/use-reports").useReports>["reports"] }) { return <div className="map-grid relative h-full">{reports.map((report, index) => <span key={report.id} className={`pin-pulse absolute flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-background ${riskOf(report).level === "high" ? "bg-danger text-danger-foreground" : "bg-caution text-caution-foreground"}`} style={{ left: `${25 + (index * 27) % 60}%`, top: `${35 + (index * 29) % 40}%` }}><MapPin className="size-4" fill="currentColor" /></span>)}</div>; }
function BottomNav({ screen, onNavigate }: { screen: Screen; onNavigate: (screen: Screen) => void }) { return <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-[1180px] items-center justify-around border-t border-border bg-background/95 px-3 py-2 backdrop-blur-lg sm:static sm:border-t sm:px-8 sm:py-4"><NavItem active={screen === "home"} onClick={() => onNavigate("home")} icon={<Droplets />} label="Home" /><NavItem active={screen === "map"} onClick={() => onNavigate("map")} icon={<Map />} label="Map" /><Button onClick={() => onNavigate("report")} size="icon" aria-label="Report water" className="-mt-7 size-14 rounded-2xl border-4 border-background shadow-xl shadow-primary/20"><Send className="size-5" /></Button><NavItem active={screen === "alerts"} onClick={() => onNavigate("alerts")} icon={<AlertTriangle />} label="Alerts" /><NavItem active={false} onClick={() => undefined} icon={<CircleUserRound />} label="You" /></nav>; }
function NavItem({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) { return <button onClick={onClick} className={`flex min-w-14 flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>{icon}<span>{label}</span></button>; }
function FieldLabel({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) { return <div><div className="mb-2 flex items-center justify-between"><label className="text-sm font-semibold">{label}</label><span className="text-xs text-muted-foreground">{hint}</span></div>{children}</div>; }
function Choice({ selected, onClick, label, icon }: { selected: boolean; onClick: () => void; label: string; icon?: string }) { return <button type="button" onClick={onClick} className={`rounded-xl border px-3 py-3 text-sm font-medium capitalize transition-all ${selected ? "border-primary bg-primary/10 text-primary ring-1 ring-primary" : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}>{icon && <span className="mr-1.5 text-base">{icon}</span>}{label}</button>; }
function Tag({ label }: { label: string }) { return <span className="rounded-md bg-secondary px-2 py-1 text-xs capitalize text-secondary-foreground">{label}</span>; }
function Stat({ icon, value, label, tone }: { icon: React.ReactNode; value: string; label: string; tone: "safe" | "danger" | "caution" }) { return <div className="rounded-2xl border border-border bg-card p-4"><div className={`mb-4 flex size-9 items-center justify-center rounded-xl ${tone === "safe" ? "bg-safe/15 text-safe" : tone === "danger" ? "bg-danger/15 text-danger" : "bg-caution/15 text-caution"}`}>{icon}</div><p className="text-2xl font-semibold">{value}</p><p className="mt-1 text-xs text-muted-foreground">{label}</p></div>; }
function OfflineBanner({ count, online }: { count: number; online: boolean }) { return <div className={`flex items-center gap-3 border-b px-5 py-3 text-sm ${online ? "border-safe/20 bg-safe/10 text-safe" : "border-caution/20 bg-caution/10 text-caution"}`}><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-current/10">{online ? <RefreshCw className="size-4" /> : <CloudOff className="size-4" />}</span><p><span className="font-semibold">{online ? "Syncing your report" : "Offline — will sync"}</span><span className="ml-1 hidden sm:inline">· {count} {count === 1 ? "report" : "reports"} waiting</span></p></div>; }
function Toast({ message }: { message: string }) { return <div className="fixed inset-x-4 top-20 z-30 mx-auto flex max-w-md items-center gap-3 rounded-xl border border-safe/30 bg-card px-4 py-3 text-sm shadow-2xl"><span className="flex size-7 items-center justify-center rounded-full bg-safe/15 text-safe"><Check className="size-4" /></span><span className="font-medium">{message}</span></div>; }
function EmptyState() { return <div className="rounded-2xl border border-dashed border-border px-5 py-10 text-center text-sm text-muted-foreground">No community reports yet.</div>; }