"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "../lib/api";

const INSTITUTE_CACHE_TTL_MS = 60 * 1000;
const INSTITUTE_FETCH_TIMEOUT_MS = Number(process.env.NEXT_PUBLIC_INSTITUTE_FETCH_TIMEOUT_MS || 12000);
const LOCAL_CACHE_KEY = "ghhs_institute_cache_v1";
let cachedInstitute = null;
let cachedAt = 0;
let inflightInstituteRequest = null;

function instituteCacheFresh() {
  return cachedInstitute && Date.now() - cachedAt < INSTITUTE_CACHE_TTL_MS;
}

function readLocalCache() {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = localStorage.getItem(LOCAL_CACHE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    const at = Number(parsed?.at || 0);
    if (!parsed?.data || !Number.isFinite(at) || at <= 0) {
      return null;
    }
    return { data: parsed.data, at };
  } catch {
    return null;
  }
}

function writeLocalCache(data, at) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify({ data, at }));
  } catch {
    // Ignore storage quota/privacy-mode errors.
  }
}

async function loadInstitute() {
  if (instituteCacheFresh()) {
    return cachedInstitute;
  }

  if (!inflightInstituteRequest) {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort("Institute request timed out");
    }, INSTITUTE_FETCH_TIMEOUT_MS);

    inflightInstituteRequest = fetch(`${API_BASE}/institute`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load institute data");
        }
        return res.json();
      })
      .then((data) => {
        cachedInstitute = data;
        cachedAt = Date.now();
        writeLocalCache(data, cachedAt);
        return data;
      })
      .finally(() => {
        clearTimeout(timer);
      })
      .finally(() => {
        inflightInstituteRequest = null;
      });
  }

  return inflightInstituteRequest;
}

export default function useInstituteData() {
  // Keep server and first client render identical to avoid hydration mismatches.
  const [institute, setInstitute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    if (instituteCacheFresh()) {
      queueMicrotask(() => {
        if (!alive) return;
        setInstitute(cachedInstitute);
        setLoading(false);
      });
      return () => {
        alive = false;
      };
    }

    const local = readLocalCache();
    if (local?.data) {
      cachedInstitute = local.data;
      cachedAt = local.at;
      queueMicrotask(() => {
        if (!alive) return;
        setInstitute(local.data);
        setLoading(false);
      });
    }

    if (instituteCacheFresh()) {
      return () => {
        alive = false;
      };
    }

    loadInstitute()
      .then((data) => {
        if (alive) {
          setInstitute(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (alive) {
          setInstitute(cachedInstitute);
          setLoading(false);
        }
      });

    return () => {
      alive = false;
    };
  }, []);

  return { institute, loading };
}

