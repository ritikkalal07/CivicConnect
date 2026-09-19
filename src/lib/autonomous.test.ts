import { describe, expect, it } from "vitest";

import {
  assessReport,
  buildAgentSnapshot,
  countRelatedClusters,
  handleChatbotQuery,
  runAnomalyAgent,
  runDetectorAgent,
  runDedupAgent,
  runEscalatorAgent,
  runRouterAgent,
  runSelfHealAgent,
  runSentimentAgent,
  runVerifierAgent,
  type OfficerCandidate,
} from "./autonomous";
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

describe("autonomous civic agent suite", () => {
  it("routes hazardous observations to urgent human review", () => {
    const result = assessReport({ clarity: "turbid", smell: "chemical", color: "brown" });
    expect(result).toMatchObject({ priority: "critical", action: "urgent-review" });
    expect(result.reasons).toHaveLength(3);
  });

  it("detects critical danger keywords and triggers immediate priority", () => {
    const result = assessReport({
      clarity: "clear",
      smell: "none",
      color: "clear",
      description: "Live electric wire exposed near drowning puddle emergency",
    });
    expect(result.priority).toBe("critical");
    expect(result.reasons).toContain("critical danger keyword detected");
  });

  it("groups nearby non-safe reports into one related cluster", () => {
    const reports = [
      report({ clarity: "cloudy", smell: "earthy" }),
      report({ latitude: 12.9717, longitude: 77.5947, smell: "sewage" }),
      report({ latitude: 12.9715, longitude: 77.5945, color: "yellow", clarity: "cloudy" }),
    ];
    expect(countRelatedClusters(reports)).toBe(1);
  });

  it("exposes autonomous capabilities in the agent snapshot", () => {
    const snapshot = buildAgentSnapshot([report({ clarity: "turbid", smell: "chemical" })]);
    expect(snapshot.mode).toBe("autonomous");
    expect(snapshot.capabilities).toContain("9 Autonomous Agents");
    expect(snapshot.agents).toHaveLength(9);
    expect(snapshot.harvesters).toHaveLength(10);
  });

  it("Router Agent ranks officers using learned performance & language match", () => {
    const candidates: OfficerCandidate[] = [
      {
        id: "off-1",
        name: "Officer A",
        department: "Roads",
        ward: "Ward 47",
        successRate: 0.95,
        avgResolutionHours: 4,
        currentLoad: 2,
        language: "kn",
      },
      {
        id: "off-2",
        name: "Officer B",
        department: "Roads",
        ward: "Ward 47",
        successRate: 0.6,
        avgResolutionHours: 48,
        currentLoad: 15,
        language: "en",
      },
    ];

    const best = runRouterAgent(candidates, "kn");
    expect(best.id).toBe("off-1");
    expect(best.score).toBeGreaterThan(0.5);
  });

  it("Escalator Agent auto-escalates past SLA or on negative sentiment", () => {
    const overdueComplaint = {
      slaDeadlineMs: Date.now() - 1000,
      currentEscalationLevel: 0,
      sentimentScore: -0.8,
    };
    const result = runEscalatorAgent(overdueComplaint);
    expect(result.shouldEscalate).toBe(true);
    expect(result.nextLevel).toBeGreaterThanOrEqual(2);
  });

  it("Verifier Agent rejects fake resolution photos and distance mismatches", () => {
    const samePhoto = runVerifierAgent({
      beforePhotoUrl: "https://img.com/p1.jpg",
      afterPhotoUrl: "https://img.com/p1.jpg",
      category: "Pothole",
    });
    expect(samePhoto.verified).toBe(false);
    expect(samePhoto.reason).toContain("identical");

    const farLocation = runVerifierAgent({
      afterPhotoUrl: "https://img.com/p2.jpg",
      category: "Pothole",
      exifDistanceMeters: 450,
    });
    expect(farLocation.verified).toBe(false);
    expect(farLocation.reason).toContain("exceeds 200m radius");
  });

  it("Detector Agent parses harvested text and auto-files urgent issues", () => {
    const result = runDetectorAgent("Huge pothole near Jayanagar 4th Block, dangerous!", {
      lat: 12.925,
      lng: 77.5938,
    });
    expect(result.detected).toBe(true);
    expect(result.autoFiled).toBe(true);
    expect(result.category).toContain("Pothole");
  });

  it("Anomaly Agent detects 3x baseline spikes and flags systemic complaints", () => {
    const result = runAnomalyAgent([
      { wardId: "Ward 12", category: "Garbage", count: 18, baseline: 3.0 },
    ]);
    expect(result.anomaliesDetected).toBe(1);
    expect(result.alerts[0]).toContain("Spike detected in Ward 12");
  });

  it("Dedup Agent merges nearby duplicate complaints within 100m", () => {
    const existing = [report({ id: "existing-1", category: "Pothole", description: "Pothole on main road" })];
    const check = runDedupAgent(
      { lat: 12.9716, lng: 77.5946, category: "Pothole", description: "Big pothole on main road" },
      existing,
    );
    expect(check.isDuplicate).toBe(true);
    expect(check.matchedId).toBe("existing-1");
  });

  it("Sentiment Agent identifies emergency danger keywords", () => {
    const res = runSentimentAgent("Open live wire causing electrocution hazard near school");
    expect(res.danger).toBe(true);
    expect(res.urgency).toBe("EMERGENCY");
    expect(res.priorityBoost).toBe(50);
  });

  it("SelfHeal Agent triggers failover when source reliability drops", () => {
    const snapshot = buildAgentSnapshot([]);
    const healResult = runSelfHealAgent(snapshot.harvesters);
    expect(healResult.healedCount).toBeGreaterThanOrEqual(1);
    expect(healResult.sourceActions[0].action).toContain("Switched method");
  });

  it("Chatbot Agent answers questions and auto-files civic issues", () => {
    const waterResp = handleChatbotQuery("What is the water timing in Ward 47?");
    expect(waterResp.intent).toBe("water_schedule");
    expect(waterResp.response).toContain("6:00 AM");

    const fileResp = handleChatbotQuery("There is a broken streetlight and garbage overflow in Jayanagar");
    expect(fileResp.autoFiledComplaint).toBe(true);
    expect(fileResp.response).toContain("registered your civic complaint");
  });
});
