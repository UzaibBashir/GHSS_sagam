"use client";

import { useCallback } from "react";
import { API_BASE } from "../lib/api";

export default function useAdminApi(token) {
  const withAuth = useCallback(
    (headers = {}) => ({ ...headers, Authorization: `Bearer ${token}` }),
    [token]
  );

  const parseResponse = async (res, fallbackMessage) => {
    let data = null;
    let text = "";

    try {
      data = await res.json();
    } catch {
      try {
        text = await res.text();
      } catch {
        text = "";
      }
    }

    if (!res.ok) {
      const message = data?.detail || text || fallbackMessage;
      const err = new Error(message);
      err.status = res.status;
      throw err;
    }

    return data || {};
  };

  const login = async (username, password) => {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: String(username || "").trim(), password: String(password || "").trim() }),
    });
    return parseResponse(res, "Login failed");
  };

  const loadDashboard = async () => {
    const res = await fetch(`${API_BASE}/admin/dashboard`, {
      headers: withAuth(),
      cache: "no-store",
    });
    return parseResponse(res, "Could not load dashboard.");
  };

  const clearContacts = async () => {
    const res = await fetch(`${API_BASE}/admin/contacts`, {
      method: "DELETE",
      headers: withAuth(),
    });
    return parseResponse(res, "Could not clear enquiries.");
  };

  const addStudent = async (payload) => {
    const res = await fetch(`${API_BASE}/admin/students`, {
      method: "POST",
      headers: withAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    });
    return parseResponse(res, "Could not add student.");
  };

  const updateStudent = async (rollNumber, payload) => {
    const res = await fetch(`${API_BASE}/admin/students/${encodeURIComponent(rollNumber)}`, {
      method: "PUT",
      headers: withAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    });
    return parseResponse(res, "Could not update student.");
  };

  const removeStudent = async (rollNumber) => {
    const res = await fetch(`${API_BASE}/admin/students/${encodeURIComponent(rollNumber)}`, {
      method: "DELETE",
      headers: withAuth(),
    });
    return parseResponse(res, "Could not delete student.");
  };

  const updateControls = async (payload) => {
    const res = await fetch(`${API_BASE}/admin/controls`, {
      method: "PATCH",
      headers: withAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    });
    return parseResponse(res, "Could not update controls.");
  };

  const updateInstitute = async (payload) => {
    const res = await fetch(`${API_BASE}/admin/institute`, {
      method: "PATCH",
      headers: withAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    });
    return parseResponse(res, "Could not update institute content.");
  };

  const updateAdmission = async (applicationId, payload) => {
    const res = await fetch(`${API_BASE}/admin/admissions/${applicationId}`, {
      method: "PATCH",
      headers: withAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    });
    return parseResponse(res, "Could not update admission status.");
  };


  const removeAdmission = async (applicationId) => {
    const res = await fetch(`${API_BASE}/admin/admissions/${applicationId}`, {
      method: "DELETE",
      headers: withAuth(),
    });
    return parseResponse(res, "Could not delete admission form.");
  };
  const addNotificationItem = async (payload) => {
    const res = await fetch(`${API_BASE}/admin/notification-items`, {
      method: "POST",
      headers: withAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    });
    return parseResponse(res, "Could not add notification.");
  };

  const updateNotificationItem = async (id, payload) => {
    const res = await fetch(`${API_BASE}/admin/notification-items/${id}`, {
      method: "PUT",
      headers: withAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    });
    return parseResponse(res, "Could not update notification.");
  };

  const removeNotificationItem = async (id) => {
    const res = await fetch(`${API_BASE}/admin/notification-items/${id}`, {
      method: "DELETE",
      headers: withAuth(),
    });
    return parseResponse(res, "Could not delete notification.");
  };

  const addNoticeboardItem = async (payload) => {
    const res = await fetch(`${API_BASE}/admin/academics/noticeboard`, {
      method: "POST",
      headers: withAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    });
    return parseResponse(res, "Could not add noticeboard item.");
  };

  const updateNoticeboardItem = async (id, payload) => {
    const res = await fetch(`${API_BASE}/admin/academics/noticeboard/${id}`, {
      method: "PUT",
      headers: withAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    });
    return parseResponse(res, "Could not update noticeboard item.");
  };

  const removeNoticeboardItem = async (id) => {
    const res = await fetch(`${API_BASE}/admin/academics/noticeboard/${id}`, {
      method: "DELETE",
      headers: withAuth(),
    });
    return parseResponse(res, "Could not delete noticeboard item.");
  };

  const addTimetableItem = async (payload) => {
    const res = await fetch(`${API_BASE}/admin/academics/timetable`, {
      method: "POST",
      headers: withAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    });
    return parseResponse(res, "Could not add timetable item.");
  };

  const updateTimetableItem = async (id, payload) => {
    const res = await fetch(`${API_BASE}/admin/academics/timetable/${id}`, {
      method: "PUT",
      headers: withAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    });
    return parseResponse(res, "Could not update timetable item.");
  };

  const removeTimetableItem = async (id) => {
    const res = await fetch(`${API_BASE}/admin/academics/timetable/${id}`, {
      method: "DELETE",
      headers: withAuth(),
    });
    return parseResponse(res, "Could not delete timetable item.");
  };

  const updateMaterials = async (materials) => {
    const res = await fetch(`${API_BASE}/admin/academics/materials`, {
      method: "PUT",
      headers: withAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify({ materials }),
    });
    return parseResponse(res, "Could not update study materials.");
  };

  const addNotice = async (payload) => {
    const res = await fetch(`${API_BASE}/admin/notices`, {
      method: "POST",
      headers: withAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    });
    return parseResponse(res, "Could not add notice.");
  };

  const updateNotice = async (index, payload) => {
    const res = await fetch(`${API_BASE}/admin/notices/${index}`, {
      method: "PUT",
      headers: withAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    });
    return parseResponse(res, "Could not update notice.");
  };

  const removeNotice = async (index) => {
    const res = await fetch(`${API_BASE}/admin/notices/${index}`, {
      method: "DELETE",
      headers: withAuth(),
    });
    return parseResponse(res, "Could not delete notice.");
  };

  const addDownload = async (payload) => {
    const res = await fetch(`${API_BASE}/admin/downloads`, {
      method: "POST",
      headers: withAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    });
    return parseResponse(res, "Could not add download.");
  };

  const updateDownload = async (index, payload) => {
    const res = await fetch(`${API_BASE}/admin/downloads/${index}`, {
      method: "PUT",
      headers: withAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    });
    return parseResponse(res, "Could not update download.");
  };

  const removeDownload = async (index) => {
    const res = await fetch(`${API_BASE}/admin/downloads/${index}`, {
      method: "DELETE",
      headers: withAuth(),
    });
    return parseResponse(res, "Could not delete download.");
  };

  return {
    login,
    loadDashboard,
    clearContacts,
    addStudent,
    updateStudent,
    removeStudent,
    updateControls,
    updateInstitute,
    updateAdmission,
    removeAdmission,
    addNotificationItem,
    updateNotificationItem,
    removeNotificationItem,
    addNoticeboardItem,
    updateNoticeboardItem,
    removeNoticeboardItem,
    addTimetableItem,
    updateTimetableItem,
    removeTimetableItem,
    updateMaterials,
    addNotice,
    updateNotice,
    removeNotice,
    addDownload,
    updateDownload,
    removeDownload,
  };
}
