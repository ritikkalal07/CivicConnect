import { getAlerts, riskOf, type WaterReport } from "./reports";

export type AgentPriority = "normal" | "high" | "critical";
export type AgentAction = "monitor" | "human-review" | "urgent-review";

export type AgentAssessment = {
  priority: AgentPriority;
  action: AgentAction;
  confidence: number;
  reasons: string[];
};

export type AgentSnapshot = {
  mode: "supervised";
  sourceCount: number;
  reportCount: number;
  highPriorityCount: number;
  clusterCount: number;
  alertCount: number;
  lastRunAt: number;
  capabilities: string[];
};

export function assessReport(
  report: Pick<WaterReport, "clarity" | "smell" | "color">,
): AgentAssessment {
  const risk = riskOf(report);
  const reasons: string[] = [];

  if (report.clarity === "turbid") reasons.push("turbid observation");
  if (report.smell === "chemical" || report.smell === "sewage") reasons.push("hazardous smell");
  if (report.color === "brown" || report.color === "green") reasons.push("unsafe color");

  if (risk.level === "high") {
    return { priority: "critical", action: "urgent-review", confidence: 0.92, reasons };
  }
  if (risk.level === "medium") {
    return { priority: "high", action: "human-review", confidence: 0.8, reasons };
  }
  return {
    priority: "normal",
    action: "monitor",
    confidence: 0.75,
    reasons: ["no immediate hazard pattern"],
  };
}

function distanceKm(a: WaterReport, b: WaterReport) {
  const radians = Math.PI / 180;
  const dLat = (b.latitude - a.latitude) * radians;
  const dLng = (b.longitude - a.longitude) * radians;
  const value =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.latitude * radians) * Math.cos(b.latitude * radians) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

export function countRelatedClusters(reports: WaterReport[], windowMs = 86_400_000, radiusKm = 1) {
  const recent = reports.filter((report) => Date.now() - report.createdAt <= windowMs);
  const visited = new Set<string>();
  let clusters = 0;

  for (const report of recent) {
    if (visited.has(report.id)) continue;
    const nearby = recent.filter(
      (candidate) => distanceKm(report, candidate) <= radiusKm && riskOf(candidate).level !== "low",
    );
    if (nearby.length >= 2) {
      clusters++;
      nearby.forEach((candidate) => visited.add(candidate.id));
    } else {
      visited.add(report.id);
    }
  }
  return clusters;
}

export function buildAgentSnapshot(reports: WaterReport[]): AgentSnapshot {
  const assessments = reports.map(assessReport);
  return {
    mode: "supervised",
    sourceCount: reports.length ? 1 : 0,
    reportCount: reports.length,
    highPriorityCount: assessments.filter((item) => item.priority !== "normal").length,
    clusterCount: countRelatedClusters(reports),
    alertCount: getAlerts(reports).length,
    lastRunAt: Date.now(),
    capabilities: ["triage", "risk scoring", "cluster detection", "human-review queue"],
  };
}
