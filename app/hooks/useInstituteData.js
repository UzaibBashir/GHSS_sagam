"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "../lib/api";

const INSTITUTE_CACHE_TTL_MS = 60 * 1000;
const INSTITUTE_FETCH_TIMEOUT_MS = Number(process.env.NEXT_PUBLIC_INSTITUTE_FETCH_TIMEOUT_MS || 12000);
let cachedInstitute = null;
let cachedAt = 0;
let inflightInstituteRequest = null;

function instituteCacheFresh() {
  return cachedInstitute && Date.now() - cachedAt < INSTITUTE_CACHE_TTL_MS;
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
  const [institute, setInstitute] = useState(() => {
    if (instituteCacheFresh()) {
      return cachedInstitute;
    }
    return null;
  });
  const [loading, setLoading] = useState(() => !institute);

  useEffect(() => {
    let alive = true;

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

