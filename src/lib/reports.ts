export type Clarity = "clear" | "cloudy" | "turbid";
export type Smell = "none" | "earthy" | "sewage" | "chemical";
export type Color = "clear" | "yellow" | "brown" | "green" | "other";
export type WaterReport = {
  id: string;
  createdAt: number;
  area: string;
  latitude: number;
  longitude: number;
  clarity: Clarity;
  smell: Smell;
  color: Color;
  ph?: number;
  tds?: number;
  turbidity?: number;
  photoUrl?: string;
  status: "synced" | "pending";
};
export type ReportInput = Omit<WaterReport, "id" | "createdAt" | "status" | "photoUrl"> & {
  photo?: File;
};

const REPORTS_KEY = "aquaalert.reports.v1";
const QUEUE_KEY = "aquaalert.queue.v1";

export function riskOf(report: Pick<WaterReport, "clarity" | "smell" | "color">) {
  const score =
    (report.clarity === "turbid" ? 2 : report.clarity === "cloudy" ? 1 : 0) +
    (report.smell === "chemical" || report.smell === "sewage"
      ? 2
      : report.smell === "earthy"
        ? 1
        : 0) +
    (report.color === "brown" || report.color === "green"
      ? 2
      : report.color === "yellow" || report.color === "other"
        ? 1
        : 0);
  if (score >= 4) return { level: "high" as const, label: "Danger", score };
  if (score >= 2) return { level: "medium" as const, label: "Caution", score };
  return { level: "low" as const, label: "Safe", score };
}

function readReports() {
  if (typeof window === "undefined") return [] as WaterReport[];
  try {
    return JSON.parse(localStorage.getItem(REPORTS_KEY) ?? "[]") as WaterReport[];
  } catch {
    return [];
  }
}
function writeReports(reports: WaterReport[]) {
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  window.dispatchEvent(new Event("reports:changed"));
}
export function getReports() {
  return readReports().sort((a, b) => b.createdAt - a.createdAt);
}
export function addReport(report: WaterReport) {
  writeReports([report, ...readReports().filter((item) => item.id !== report.id)]);
}

function formFor(input: Record<string, unknown>) {
  const form = new FormData();
  Object.entries(input).forEach(([key, value]) => {
    if (key !== "photo" && value !== undefined) form.set(key, String(value));
  });
  if (input.photo instanceof File) form.set("photo", input.photo);
  return form;
}

export function queueReport(input: ReportInput) {
  const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) ?? "[]") as Array<
    Record<string, unknown>
  >;
  const queued = { ...input, photo: undefined, queuedAt: Date.now() } as Record<string, unknown>;
  if (input.photo) {
    const reader = new FileReader();
    reader.onload = () =>
      localStorage.setItem(
        QUEUE_KEY,
        JSON.stringify([...queue, { ...queued, photoData: reader.result }]),
      );
    reader.readAsDataURL(input.photo);
  } else localStorage.setItem(QUEUE_KEY, JSON.stringify([...queue, queued]));
  return {
    ...input,
    id: `offline-${Date.now()}`,
    createdAt: Date.now(),
    status: "pending" as const,
    photoUrl: undefined,
  } as WaterReport;
}

export async function submitReport(input: ReportInput, online: boolean) {
  if (!online) return queueReport(input);
  const response = await fetch("/api/reports", { method: "POST", body: formFor(input) });
  if (!response.ok) throw new Error("The report could not be saved");
  return (await response.json()) as WaterReport;
}

export async function syncPending() {
  if (!navigator.onLine) return 0;
  const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) ?? "[]") as Array<
    Record<string, unknown>
  >;
  const remaining: Array<Record<string, unknown>> = [];
  let synced = 0;
  for (const item of queue) {
    try {
      let photo: File | undefined;
      if (typeof item.photoData === "string")
        photo = new File(
          [await fetch(item.photoData).then((response) => response.blob())],
          "water-report.jpg",
          { type: "image/jpeg" },
        );
      const response = await fetch("/api/reports", {
        method: "POST",
        body: formFor({ ...item, photo }),
      });
      if (!response.ok) throw new Error("sync failed");
      addReport({ ...(await response.json()), status: "synced" });
      synced++;
    } catch {
      remaining.push(item);
    }
  }
  localStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
  return synced;
}

function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const radians = Math.PI / 180;
  const dLat = (bLat - aLat) * radians;
  const dLng = (bLng - aLng) * radians;
  const value =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(aLat * radians) * Math.cos(bLat * radians) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}
export function getAlerts(reports: WaterReport[]) {
  const danger = reports.filter(
    (report) => riskOf(report).level === "high" && Date.now() - report.createdAt <= 86_400_000,
  );
  return danger
    .flatMap((report) => {
      const nearby = danger.filter(
        (candidate) =>
          distanceKm(report.latitude, report.longitude, candidate.latitude, candidate.longitude) <=
          1,
      );
      return nearby.length >= 3
        ? [
            {
              id: report.id,
              area: report.area,
              count: nearby.length,
              latestCreatedAt: Math.max(...nearby.map((item) => item.createdAt)),
            },
          ]
        : [];
    })
    .filter(
      (alert, index, all) =>
        all.findIndex((item) => item.area === alert.area && item.count === alert.count) === index,
    );
}
export function timeAgo(timestamp: number) {
  const minutes = Math.max(1, Math.round((Date.now() - timestamp) / 60000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.round(hours / 24)} d ago`;
}
