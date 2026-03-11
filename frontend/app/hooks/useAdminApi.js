"use client";

import { useCallback } from "react";
import { API_BASE } from "../lib/api";

export default function useAdminApi(token) {
  const withAuth = useCallback(
    (headers = {}) => ({ ...headers, Authorization: `Bearer ${token}` }),
    [token]
  );

  const login = async (username, password) => {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.detail || "Login failed");
    return data;
  };

  const loadDashboard = async () => {
    const [noticeRes, contactsRes, controlsRes] = await Promise.all([
      fetch(`${API_BASE}/admin/notices`, { headers: withAuth() }),
      fetch(`${API_BASE}/admin/contacts`, { headers: withAuth() }),
      fetch(`${API_BASE}/admin/controls`, { headers: withAuth() }),
    ]);

    if (!noticeRes.ok || !contactsRes.ok || !controlsRes.ok) {
      throw new Error("Session expired. Please login again.");
    }

    const notices = await noticeRes.json();
    const contacts = await contactsRes.json();
    const controls = await controlsRes.json();
    return { notices, contacts, controls };
  };

  const addNotice = async (text) => {
    const res = await fetch(`${API_BASE}/admin/notices`, {
      method: "POST",
      headers: withAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.detail || "Could not add notice.");
  };

  const removeNotice = async (noticeIndex) => {
    const res = await fetch(`${API_BASE}/admin/notices/${noticeIndex}`, {
      method: "DELETE",
      headers: withAuth(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.detail || "Could not remove notice.");
  };

  const clearContacts = async () => {
    const res = await fetch(`${API_BASE}/admin/contacts`, {
      method: "DELETE",
      headers: withAuth(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.detail || "Could not clear enquiries.");
  };

  const updateControls = async (payload) => {
    const res = await fetch(`${API_BASE}/admin/controls`, {
      method: "PATCH",
      headers: withAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.detail || "Could not update controls.");
    return data;
  };

  return {
    login,
    loadDashboard,
    addNotice,
    removeNotice,
    clearContacts,
    updateControls,
  };
}