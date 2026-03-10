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
    const [noticeRes, contactsRes, downloadsRes] = await Promise.all([
      fetch(`${API_BASE}/admin/notices`, { headers: withAuth() }),
      fetch(`${API_BASE}/admin/contacts`, { headers: withAuth() }),
      fetch(`${API_BASE}/admin/downloads`, { headers: withAuth() }),
    ]);

    if (!noticeRes.ok || !contactsRes.ok || !downloadsRes.ok) {
      throw new Error("Session expired. Please login again.");
    }

    const notices = await noticeRes.json();
    const contacts = await contactsRes.json();
    const downloads = await downloadsRes.json();
    return { notices, contacts, downloads };
  };

  const addNotice = async (text) => {
    const res = await fetch(`${API_BASE}/admin/notices`, {
      method: "POST",
      headers: withAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error("Could not add notice.");
  };

  const removeNotice = async (noticeIndex) => {
    const res = await fetch(`${API_BASE}/admin/notices/${noticeIndex}`, {
      method: "DELETE",
      headers: withAuth(),
    });
    if (!res.ok) throw new Error("Could not remove notice.");
  };

  const addDownload = async (title, url) => {
    const res = await fetch(`${API_BASE}/admin/downloads`, {
      method: "POST",
      headers: withAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify({ title, url }),
    });
    if (!res.ok) throw new Error("Could not add download item.");
  };

  const removeDownload = async (downloadIndex) => {
    const res = await fetch(`${API_BASE}/admin/downloads/${downloadIndex}`, {
      method: "DELETE",
      headers: withAuth(),
    });
    if (!res.ok) throw new Error("Could not remove download item.");
  };

  const clearContacts = async () => {
    const res = await fetch(`${API_BASE}/admin/contacts`, {
      method: "DELETE",
      headers: withAuth(),
    });
    if (!res.ok) throw new Error("Could not clear enquiries.");
  };

  return {
    login,
    loadDashboard,
    addNotice,
    removeNotice,
    addDownload,
    removeDownload,
    clearContacts,
  };
}

