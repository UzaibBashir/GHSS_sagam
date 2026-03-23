"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "../lib/api";

const INSTITUTE_CACHE_TTL_MS = 60 * 1000;
let cachedInstitute = null;
let cachedAt = 0;
let inflightInstituteRequest = null;

function readBootstrappedInstitute() {
  if (typeof window === "undefined") {
    return null;
  }

  const boot = window.__GHHS_BOOTSTRAP__;
  return boot?.institute || null;
}

function instituteCacheFresh() {
  return cachedInstitute && Date.now() - cachedAt < INSTITUTE_CACHE_TTL_MS;
}

async function loadInstitute() {
  if (instituteCacheFresh()) {
    return cachedInstitute;
  }

  if (!inflightInstituteRequest) {
    inflightInstituteRequest = fetch(`${API_BASE}/institute`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load institute data");
        }
        return res.json();
      })
      .then((data) => {
        cachedInstitute = data;
        cachedAt = Date.now();
        return data;
      })
      .finally(() => {
        inflightInstituteRequest = null;
      });
  }

  return inflightInstituteRequest;
}

export default function useInstituteData() {
  const [institute, setInstitute] = useState(() => {
    if (instituteCacheFresh()) {
      return cachedInstitute;
    }

    const boot = readBootstrappedInstitute();
    if (boot) {
      cachedInstitute = boot;
      cachedAt = Date.now();
      return boot;
    }

    return null;
  });
  const [loading, setLoading] = useState(() => !institute);

  useEffect(() => {
    let alive = true;

    if (institute) {
      setLoading(false);
      return () => {
        alive = false;
      };
    }

    setLoading(true);

    loadInstitute()
      .then((data) => {
        if (alive) {
          setInstitute(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (alive) {
          setInstitute(null);
          setLoading(false);
        }
      });

    return () => {
      alive = false;
    };
  }, []);

  return { institute, loading };
}

