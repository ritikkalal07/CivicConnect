import { useCallback, useEffect, useState } from "react";
import { getReports, syncPending, type WaterReport } from "@/lib/reports";

export function useReports() {
  const [reports, setReports] = useState<WaterReport[]>([]);
  const refresh = useCallback(() => setReports(getReports()), []);

  useEffect(() => {
    refresh();
    window.addEventListener("reports:changed", refresh);
    return () => window.removeEventListener("reports:changed", refresh);
  }, [refresh]);

  return { reports, refresh };
}

export function useOnlineStatus() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);
    const up = () => {
      setOnline(true);
      syncPending();
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