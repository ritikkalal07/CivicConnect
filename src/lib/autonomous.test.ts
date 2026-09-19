import { describe, expect, it } from "vitest";

import { assessReport, buildAgentSnapshot, countRelatedClusters } from "./autonomous";
import type { WaterReport } from "./reports";

function report(overrides: Partial<WaterReport> = {}): WaterReport {
  return {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    area: "Ward 12",
    latitude: 12.9716,
    longitude: 77.5946,
    clarity: "clear",
    smell: "none",
    color: "clear",
    status: "synced",
    ...overrides,
  };
}

describe("supervised civic agent", () => {
  it("routes hazardous observations to urgent human review", () => {
    const result = assessReport({ clarity: "turbid", smell: "chemical", color: "brown" });
    expect(result).toMatchObject({ priority: "critical", action: "urgent-review" });
    expect(result.reasons).toHaveLength(3);
  });

  it("groups nearby non-safe reports into one related cluster", () => {
    const reports = [
      report({ clarity: "cloudy", smell: "earthy" }),
      report({ latitude: 12.9717, longitude: 77.5947, smell: "sewage" }),
      report({ latitude: 12.9715, longitude: 77.5945, color: "yellow", clarity: "cloudy" }),
    ];
    expect(countRelatedClusters(reports)).toBe(1);
  });

  it("exposes truthful supervised capabilities in the agent snapshot", () => {
    const snapshot = buildAgentSnapshot([report({ clarity: "turbid", smell: "chemical" })]);
    expect(snapshot.mode).toBe("supervised");
    expect(snapshot.capabilities).toContain("human-review queue");
    expect(snapshot.highPriorityCount).toBe(1);
  });
});
