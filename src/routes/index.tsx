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
  AlertTriangle,
  Camera,
  CheckCircle2,
  Droplets,
  LocateFixed,
  Map,
  RefreshCw,
  Send,
  ShieldCheck,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOnlineStatus, useReports } from "@/hooks/use-reports";
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
      { title: "JalDarpan | Community Water Safety" },
      {
        name: "description",
        content: "Report water quality concerns and help your community respond quickly.",
      },
    ],
  }),
  component: JalDarpanApp,
});
type Screen = "home" | "report" | "map" | "alerts";

function JalDarpanApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const { reports, loading, error, refresh } = useReports();
  const online = useOnlineStatus();
  const [message, setMessage] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const alerts = useMemo(() => getAlerts(reports), [reports]);

  async function handleSubmit(input: ReportInput) {
    setErrorMessage(undefined);
    try {
      const report = await submitReport(input, online);
      if (!online || report.status === "pending") {
        addReport(report);
        setMessage("Offline - reports will sync when online");
      } else {
        await refresh();
        setMessage("Report submitted successfully");
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
          setMessage(`${count} offline report${count === 1 ? "" : "s"} synced`);
          void refresh();
        }
      });
  }, [online, refresh]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <button
            className="flex items-center gap-3 text-left"
            onClick={() => setScreen("home")}
            aria-label="Go to home"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Droplets className="size-5" />
            </span>
            <span>
              <strong className="block text-base font-semibold">JalDarpan</strong>
              <span className="hidden text-xs text-text-secondary sm:block">
                Community water safety
              </span>
            </span>
          </button>
          <nav aria-label="Primary navigation" className="hidden items-center gap-1 sm:flex">
            <NavItem
              active={screen === "home"}
              onClick={() => setScreen("home")}
              icon={<Droplets />}
              label="Home"
              compact
            />
            <NavItem
              active={screen === "map"}
              onClick={() => setScreen("map")}
              icon={<Map />}
              label="Map"
              compact
            />
            <NavItem
              active={screen === "alerts"}
              onClick={() => setScreen("alerts")}
              icon={<AlertTriangle />}
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
              <Send />
              Report water quality
            </Button>
          </nav>
          <span
            className={`flex shrink-0 items-center gap-2 text-xs font-medium ${online ? "text-safe" : "text-caution"}`}
          >
            <span className={`size-2 rounded-full ${online ? "bg-safe" : "bg-caution"}`} />
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
        </div>
      </header>
      {!online && (
        <div className="border-b border-caution bg-caution-soft px-4 py-3 text-center text-sm text-text-primary">
          Offline - reports will sync when online
        </div>
      )}
      {message && <Toast message={message} onClose={() => setMessage(undefined)} />}
      <div className="mx-auto max-w-6xl px-4 py-6 pb-24 sm:px-6 sm:py-10 sm:pb-10">
        {error && <Notice text="Unable to load reports. Check your connection and try again." />}
        {errorMessage && <Notice text={errorMessage} />}
        {screen === "home" && (
          <HomeScreen
            reports={reports}
            alerts={alerts}
            loading={loading}
            onReport={() => setScreen("report")}
            onNavigate={setScreen}
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
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border/80 bg-card/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_18px_rgb(31_41_51_/_6%)] backdrop-blur sm:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
          <NavItem
            active={screen === "home"}
            onClick={() => setScreen("home")}
            icon={<Droplets />}
            label="Home"
          />
          <NavItem
            active={screen === "map"}
            onClick={() => setScreen("map")}
            icon={<Map />}
            label="Map"
          />
          <Button
            onClick={() => setScreen("report")}
            size="icon"
            aria-label="Report water quality"
            aria-current={screen === "report" ? "page" : undefined}
            className={`size-11 rounded-full ${screen === "report" ? "ring-2 ring-primary/30 ring-offset-2" : ""}`}
          >
            <Send className="size-4" />
          </Button>
          <NavItem
            active={screen === "alerts"}
            onClick={() => setScreen("alerts")}
            icon={<AlertTriangle />}
            label="Alerts"
          />
        </div>
      </nav>
    </main>
  );
}

function HomeScreen({
  reports,
  alerts,
  loading,
  onReport,
  onNavigate,
}: {
  reports: WaterReport[];
  alerts: ReturnType<typeof getAlerts>;
  loading: boolean;
  onReport: () => void;
  onNavigate: (screen: Screen) => void;
}) {
  return (
    <section className="space-y-8">
      <div className="grid gap-8 border-b border-border pb-8 lg:grid-cols-[1fr_360px] lg:items-center">
        <div>
          <p className="mb-3 text-sm font-medium text-primary">Community water safety</p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Report concerns. Protect your community.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-text-secondary">
            Share what you observe in your water supply so nearby residents can make informed
            decisions.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button onClick={onReport} size="lg">
              <Droplets className="size-4" /> Report Water Quality
            </Button>
            <Button onClick={() => onNavigate("map")} variant="outline" size="lg">
              <Map className="size-4" /> View Map
            </Button>
          </div>
        </div>
        <div className="rounded-md border border-border bg-card p-5 shadow-card">
          <p className="text-sm font-medium text-text-secondary">Community activity</p>
          <p className="mt-2 text-3xl font-semibold">{reports.length}</p>
          <p className="text-sm text-text-secondary">reports received</p>
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4">
            <div>
              <p className="text-xl font-semibold text-danger">{alerts.length}</p>
              <p className="text-xs text-text-secondary">active alerts</p>
            </div>
            <div>
              <p className="text-xl font-semibold text-safe">
                {reports.filter((report) => riskOf(report).level === "low").length}
              </p>
              <p className="text-xs text-text-secondary">safe observations</p>
            </div>
          </div>
        </div>
      </div>
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Alerts</h2>
          <Button variant="ghost" size="sm" onClick={() => onNavigate("alerts")}>
            View all
          </Button>
        </div>
        {loading ? (
          <LoadingState />
        ) : alerts[0] ? (
          <AlertCard alert={alerts[0]} />
        ) : (
          <EmptyState text="No reports yet." />
        )}
      </section>
    </section>
  );
}

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
  const [clarity, setClarity] = useState<Clarity | "">("");
  const [smell, setSmell] = useState<Smell | "">("");
  const [color, setColor] = useState<Color | "">("");
  const [ph, setPh] = useState("");
  const [tds, setTds] = useState("");
  const [turbidity, setTurbidity] = useState("");
  const [photo, setPhoto] = useState<File>();
  const [photoPreview, setPhotoPreview] = useState<string>();
  const [validation, setValidation] = useState<string>();
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  function findLocation() {
    if (!navigator.geolocation) {
      setValidation("Location is not available in this browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setArea("Current location");
        setLocating(false);
      },
      () => {
        setValidation("Unable to access your location");
        setLocating(false);
      },
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
    if (!latitude || !longitude || !clarity || !smell || !color) {
      setValidation("Location, clarity, smell, and color are required");
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
        ph: ph ? Number(ph) : undefined,
        tds: tds ? Number(tds) : undefined,
        turbidity: turbidity ? Number(turbidity) : undefined,
        photo,
      });
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <section className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-5">
        Back
      </Button>
      <h1 className="text-3xl font-semibold">Report Water Quality</h1>
      <p className="mt-2 text-text-secondary">
        Your observation helps nearby residents respond to water concerns.
      </p>
      <form onSubmit={submit} className="mt-8 space-y-6">
        <div className="rounded-md border border-border bg-card p-4 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">Location</h2>
              <p className="mt-1 text-sm text-text-secondary">Use GPS or enter coordinates.</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={findLocation}
              disabled={locating}
            >
              <LocateFixed className="size-4" />
              {locating ? "Locating" : "Use GPS"}
            </Button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <InputField label="Area name" value={area} onChange={setArea} />
            <InputField
              label="Latitude"
              value={latitude}
              onChange={setLatitude}
              type="number"
              step="any"
              required
            />
            <InputField
              label="Longitude"
              value={longitude}
              onChange={setLongitude}
              type="number"
              step="any"
              required
            />
          </div>
        </div>
        <ChoiceField
          label="Clarity"
          values={["clear", "cloudy", "turbid"]}
          value={clarity}
          onChange={setClarity}
        />
        <ChoiceField
          label="Smell"
          values={["none", "earthy", "sewage", "chemical"]}
          value={smell}
          onChange={setSmell}
        />
        <ChoiceField
          label="Color"
          values={["clear", "yellow", "brown", "green", "other"]}
          value={color}
          onChange={setColor}
        />
        <div className="rounded-md border border-border bg-card p-4 shadow-card">
          <h2 className="font-semibold">Optional measurements</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <InputField
              label="pH"
              value={ph}
              onChange={setPh}
              type="number"
              step="any"
              min="0"
              max="14"
            />
            <InputField label="TDS (ppm)" value={tds} onChange={setTds} type="number" min="0" />
            <InputField
              label="Turbidity"
              value={turbidity}
              onChange={setTurbidity}
              type="number"
              min="0"
              step="any"
            />
          </div>
        </div>
        <div className="rounded-md border border-border bg-card p-4 shadow-card">
          <h2 className="font-semibold">Photo</h2>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={pickPhoto}
            className="sr-only"
          />
          {photoPreview ? (
            <div className="relative mt-3">
              <img
                src={photoPreview}
                alt="Water sample"
                className="h-48 w-full rounded-md object-cover"
              />
              <button
                type="button"
                aria-label="Remove photo"
                onClick={() => {
                  setPhoto(undefined);
                  setPhotoPreview(undefined);
                }}
                className="absolute right-2 top-2 rounded-md bg-card p-2 text-danger shadow-card"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border px-4 py-8 text-sm text-text-secondary hover:border-primary hover:text-primary"
            >
              <Camera className="size-5" /> Add a photo
            </button>
          )}
        </div>
        {validation && <Notice text={validation} />}
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span className={`size-2 rounded-full ${online ? "bg-safe" : "bg-caution"}`} />
          {online ? "Report will be submitted now" : "Report will be saved offline"}
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? (
            <>
              <RefreshCw className="size-4 animate-spin" /> Submitting
            </>
          ) : (
            <>
              <Send className="size-4" /> Submit Report
            </>
          )}
        </Button>
      </form>
    </section>
  );
}

function MapScreen({ reports, onBack }: { reports: WaterReport[]; onBack: () => void }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<WaterReport>();
  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let cancelled = false;
    void import("leaflet").then((leaflet) => {
      if (cancelled || !mapRef.current) return;
      map = leaflet.map(mapRef.current).setView([22.98, 88.43], 12);
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
    <section>
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-5">
        Back
      </Button>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-primary">Community Safety Map</p>
          <h1 className="mt-1 text-3xl font-semibold">Water reports near you</h1>
        </div>
        <div className="flex gap-3 text-xs text-text-secondary">
          <span>
            <i className="legend-dot safe" /> Safe
          </span>
          <span>
            <i className="legend-dot medium" /> Caution
          </span>
          <span>
            <i className="legend-dot high" /> Danger
          </span>
        </div>
      </div>
      {reports.length ? (
        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_300px]">
          <div ref={mapRef} className="leaflet-map" />
          {selected ? (
            <div className="rounded-md border border-border bg-card p-4 shadow-card">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Report details</h2>
                <button onClick={() => setSelected(undefined)} aria-label="Close details">
                  <X className="size-4" />
                </button>
              </div>
              <p className="mt-4 text-sm text-text-secondary">{selected.area}</p>
              <p className="mt-2 text-sm">
                {selected.clarity} water, {selected.smell} smell, {selected.color} color
              </p>
              {selected.photoUrl && (
                <img
                  src={selected.photoUrl}
                  alt="Reported water"
                  className="mt-4 h-40 w-full rounded-md object-cover"
                />
              )}
              <p className="mt-4 text-xs text-text-secondary">{timeAgo(selected.createdAt)}</p>
            </div>
          ) : (
            <EmptyState text="Select a pin to view report details." />
          )}
        </div>
      ) : (
        <EmptyState text="No reports yet." />
      )}
    </section>
  );
}
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
    <section className="mx-auto max-w-3xl">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-5">
        Back
      </Button>
      <h1 className="text-3xl font-semibold">Recent Alerts</h1>
      <p className="mt-2 text-text-secondary">
        Alerts are generated from three or more danger reports within 1 km in the last 24 hours.
      </p>
      <div className="mt-6 space-y-3">
        {loading ? (
          <LoadingState />
        ) : alerts.length ? (
          alerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
        ) : (
          <EmptyState text="No reports yet." />
        )}
      </div>
    </section>
  );
}
function AlertCard({ alert }: { alert: ReturnType<typeof getAlerts>[number] }) {
  return (
    <article className="rounded-md border border-danger bg-danger-soft p-4">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-danger" />
        <div>
          <h2 className="font-semibold text-danger">Water Safety Alert in your area.</h2>
          <p className="mt-1 text-sm text-text-primary">
            {alert.count} danger reports near {alert.area} in the last 24 hours.
          </p>
          <p className="mt-2 text-xs text-text-secondary">
            Latest report {timeAgo(alert.latestCreatedAt)}
          </p>
        </div>
      </div>
    </article>
  );
}
function InputField({
  label,
  value,
  onChange,
  type = "text",
  step,
  min,
  max,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  step?: string;
  min?: string;
  max?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        step={step}
        min={min}
        max={max}
        className="mt-2 w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}
function ChoiceField({
  label,
  values,
  value,
  onChange,
}: {
  label: string;
  values: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">{label}</legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {values.map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => onChange(item)}
            className={`rounded-md border px-3 py-3 text-sm capitalize ${value === item ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-text-secondary hover:border-primary"}`}
          >
            {item}
          </button>
        ))}
      </div>
    </fieldset>
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
      className={`relative flex items-center justify-center gap-2 rounded-md text-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring ${compact ? "px-3 py-2" : "min-w-16 flex-col gap-1 px-3 py-1.5"} ${active ? "bg-primary/10 font-semibold text-primary" : "text-text-secondary hover:bg-muted hover:text-foreground"}`}
    >
      <span className="[&>svg]:size-5">{icon}</span>
      <span>{label}</span>
      {active && (
        <span className="absolute inset-x-3 -bottom-1 hidden h-0.5 rounded-full bg-primary sm:block" />
      )}
    </button>
  );
}
function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-md border border-dashed border-border bg-card px-5 py-10 text-center text-sm text-text-secondary">
      <ShieldCheck className="mx-auto mb-2 size-5" />
      {text}
    </div>
  );
}
function LoadingState() {
  return (
    <div className="rounded-md border border-border bg-card px-5 py-10 text-center text-sm text-text-secondary">
      <RefreshCw className="mx-auto mb-2 size-5 animate-spin" />
      Loading…
    </div>
  );
}
function Notice({ text }: { text: string }) {
  return (
    <div className="mb-5 rounded-md border border-danger bg-danger-soft p-3 text-sm text-danger">
      {text}
    </div>
  );
}
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed right-4 top-4 z-30 flex max-w-sm items-center gap-3 rounded-md border border-safe bg-success-soft px-4 py-3 text-sm text-safe shadow-card">
      <CheckCircle2 className="size-4 shrink-0" />
      {message}
      <button onClick={onClose} aria-label="Close message" className="ml-auto">
        <X className="size-4" />
      </button>
    </div>
  );
}
