import { useCallback, useEffect, useState } from "react";
import { getReports, syncPending, type WaterReport } from "@/lib/reports";

export function useReports() {
  const [reports, setReports] = useState<WaterReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/reports");
      if (!response.ok) throw new Error("Reports unavailable");
      const remote = (await response.json()) as WaterReport[];
      localStorage.setItem("aquaalert.reports.v1", JSON.stringify(remote));
      setReports(remote);
      setError(false);
    } catch {
      setReports(getReports());
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void refresh();
    const handler = () => void refresh();
    window.addEventListener("reports:changed", handler);
    return () => window.removeEventListener("reports:changed", handler);
  }, [refresh]);
  return { reports, loading, error, refresh };
}

export function useOnlineStatus() {
  const [online, setOnline] = useState(() => typeof navigator === "undefined" || navigator.onLine);
  useEffect(() => {
    const up = () => {
      setOnline(true);
      void syncPending();
    };
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);
  return online;
}
