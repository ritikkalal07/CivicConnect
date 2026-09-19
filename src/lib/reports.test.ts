import { describe, expect, it } from "vitest";

import { getAlerts, riskOf, type WaterReport } from "./reports";

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

describe("CivicConnect issue risk", () => {
  it("classifies a clean observation as safe", () => {
    expect(riskOf(report())).toMatchObject({ level: "low", label: "Safe", score: 0 });
  });

  it("raises a dangerous observation to high priority", () => {
    expect(
      riskOf(report({ clarity: "turbid", smell: "chemical", color: "brown" })),
    ).toMatchObject({ level: "high", label: "Danger" });
  });
});

describe("priority alert detection", () => {
  it("creates one alert for three nearby danger reports in 24 hours", () => {
    const reports = [
      report(),
      report({ latitude: 12.9717, longitude: 77.5947 }),
      report({ latitude: 12.9715, longitude: 77.5945 }),
    ].map((item) => ({
      ...item,
      clarity: "turbid" as const,
      smell: "chemical" as const,
      color: "brown" as const,
    }));

    expect(getAlerts(reports)).toHaveLength(1);
    expect(getAlerts(reports)[0]).toMatchObject({ area: "Ward 12", count: 3 });
  });

  it("does not alert for an old or isolated danger report", () => {
    const old = report({
      createdAt: Date.now() - 86_400_001,
      clarity: "turbid",
      smell: "chemical",
      color: "brown",
    });
    const isolated = report({
      latitude: 28.6139,
      longitude: 77.209,
      clarity: "turbid",
      smell: "chemical",
      color: "brown",
    });

    expect(getAlerts([old, isolated])).toEqual([]);
  });
});