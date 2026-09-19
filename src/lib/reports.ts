export type Clarity = "clear" | "cloudy" | "turbid";
export type Smell = "none" | "earthy" | "sewage" | "chemical";

export type WaterReport = {
  id: string;
  createdAt: number;
  area: string;
  lat: number;
  lng: number;
  clarity: Clarity;
  smell: Smell;
  note: string;
  photo?: string;
  status: "synced" | "pending";
};

const KEY = "jaldarpan.reports.v1";

export const RISK_WEIGHT: Record<Clarity | Smell, number> = {
  clear: 0,
  cloudy: 1,
  turbid: 2,
  none: 0,
  earthy: 1,
  sewage: 2,
  chemical: 3,
};

export function riskOf(r: Pick<WaterReport, "clarity" | "smell">) {
  const score = RISK_WEIGHT[r.clarity] + RISK_WEIGHT[r.smell];
  if (score >= 4) return { level: "high" as const, label: "High risk", score };
  if (score >= 2) return { level: "medium" as const, label: "Caution", score };
  return { level: "low" as const, label: "Looks safe", score };
}

const SEED: WaterReport[] = [
  {
    id: "seed-1",
    createdAt: Date.now() - 1000 * 60 * 52,
    area: "Kalyani Ward 6",
    lat: 22.98,
    lng: 88.43,
    clarity: "turbid",
    smell: "sewage",
    note: "Handpump water brown after rain.",
    status: "synced",
  },
  {
    id: "seed-2",
    createdAt: Date.now() - 1000 * 60 * 180,
    area: "Riverside Colony",
    lat: 22.96,
    lng: 88.41,
    clarity: "cloudy",
    smell: "earthy",
    note: "Slight muddy taste in tap supply.",
    status: "synced",
  },
  {
    id: "seed-3",
    createdAt: Date.now() - 1000 * 60 * 400,
    area: "Station Road",
    lat: 22.99,
    lng: 88.39,
    clarity: "clear",
    smell: "none",
    note: "Community tank refilled, water fine.",
    status: "synced",
  },
];

function read(): WaterReport[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      window.localStorage.setItem(KEY, JSON.stringify(SEED));
      return SEED;
    }
    return JSON.parse(raw) as WaterReport[];
  } catch {
    return SEED;
  }
}

function write(reports: WaterReport[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(reports));
  window.dispatchEvent(new Event("reports:changed"));
}

export function getReports(): WaterReport[] {
  return read().sort((a, b) => b.createdAt - a.createdAt);
}

export function addReport(input: Omit<WaterReport, "id" | "createdAt" | "status" | "photo"> & { photo?: string | undefined }) {
  const online = typeof navigator === "undefined" ? true : navigator.onLine;
  const report: WaterReport = {
    ...input,
    ...(input.photo ? { photo: input.photo } : {}),
    id: `r-${Date.now()}`,
    createdAt: Date.now(),
    status: online ? "synced" : "pending",
  };
  write([report, ...read()]);
  return report;
}

export function syncPending(): number {
  const all = read();
  const pending = all.filter((r) => r.status === "pending");
  if (!pending.length) return 0;
  write(all.map((r) => (r.status === "pending" ? { ...r, status: "synced" as const } : r)));
  return pending.length;
}

export function timeAgo(ts: number) {
  const mins = Math.max(1, Math.round((Date.now() - ts) / 60000));
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.round(hrs / 24)} d ago`;
}