"use client";

import { useReportWebVitals } from "next/web-vitals";
import { API_BASE } from "../../lib/api";

function sendMetric(payload) {
  const body = JSON.stringify(payload);

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(`${API_BASE}/monitoring/events`, blob);
    return;
  }

  fetch(`${API_BASE}/monitoring/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

export default function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    sendMetric({
      kind: "web_vital",
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      page: typeof window !== "undefined" ? window.location.pathname : "",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      at: new Date().toISOString(),
    });
  });

  return null;
}
