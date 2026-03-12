"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "../lib/api";

export default function useInstituteData() {
  const [institute, setInstitute] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/institute`)
      .then((res) => res.json())
      .then((data) => setInstitute(data))
      .catch(() => setInstitute(null));
  }, []);

  return { institute };
}
