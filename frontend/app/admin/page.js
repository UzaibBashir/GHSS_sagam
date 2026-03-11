"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import AcademicsManager from "../components/admin/AcademicsManager";
import AdminLoginCard from "../components/admin/AdminLoginCard";
import EnquiriesManager from "../components/admin/EnquiriesManager";
import NotificationsManager from "../components/admin/NotificationsManager";
import useAdminApi from "../hooks/useAdminApi";
import { PAGE_MAIN } from "../lib/uiClasses";

const toErrorMessage = (error) => String(error?.message || error);

const defaultControls = {
  notifications_page_enabled: true,
  academics_page_enabled: true,
  admission_open: true,
  admission_form_url: "https://forms.google.com",
};

const defaultAcademicContent = {
  noticeboard: [],
  timetable: [],
  materials: [],
};

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("admin_token") || "";
  });
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState("");
  const [notificationItems, setNotificationItems] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [controls, setControls] = useState(defaultControls);
  const [academicContent, setAcademicContent] = useState(defaultAcademicContent);

  const adminApi = useAdminApi(token);

  const refreshDashboard = useCallback(async () => {
    if (!token) return;

    try {
      const data = await adminApi.loadDashboard();
      setNotificationItems(data.notificationItems || []);
      setContacts(data.contacts || []);
      setControls({ ...defaultControls, ...data.controls });
      setAcademicContent({ ...defaultAcademicContent, ...(data.academicContent || {}) });
      setConnected(true);
      setStatus("Secure portal ready.");
    } catch (error) {
      setConnected(false);
      localStorage.removeItem("admin_token");
      setStatus(toErrorMessage(error));
    }
  }, [adminApi, token]);

  useEffect(() => {
    if (!token) return;
    const timer = setTimeout(() => {
      refreshDashboard();
    }, 0);
    return () => clearTimeout(timer);
  }, [token, refreshDashboard]);

  const login = async () => {
    try {
      const data = await adminApi.login(username, password);
      setToken(data.token);
      localStorage.setItem("admin_token", data.token);
      setPassword("");
      setStatus("Login successful.");
    } catch (error) {
      setConnected(false);
      setStatus(toErrorMessage(error));
    }
  };

  const logout = () => {
    setToken("");
    setConnected(false);
    setNotificationItems([]);
    setContacts([]);
    setControls(defaultControls);
    setAcademicContent(defaultAcademicContent);
    localStorage.removeItem("admin_token");
    setStatus("Logged out.");
  };

  const handleClearContacts = async () => {
    try {
      await adminApi.clearContacts();
      setContacts([]);
      setStatus("All enquiries cleared.");
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const updateControlField = async (updates, successMessage) => {
    try {
      const data = await adminApi.updateControls(updates);
      setControls({ ...defaultControls, ...data });
      setStatus(successMessage);
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleAddNotification = async (payload) => {
    try {
      await adminApi.addNotificationItem(payload);
      setStatus("Notification added.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleSaveNotification = async (id, payload) => {
    try {
      await adminApi.updateNotificationItem(id, payload);
      setStatus("Notification updated.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleRemoveNotification = async (id) => {
    try {
      await adminApi.removeNotificationItem(id);
      setStatus("Notification deleted.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleAddNoticeboard = async (payload) => {
    try {
      await adminApi.addNoticeboardItem(payload);
      setStatus("Noticeboard item added.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleSaveNoticeboard = async (id, payload) => {
    try {
      await adminApi.updateNoticeboardItem(id, payload);
      setStatus("Noticeboard item updated.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleRemoveNoticeboard = async (id) => {
    try {
      await adminApi.removeNoticeboardItem(id);
      setStatus("Noticeboard item deleted.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleAddTimetable = async (payload) => {
    try {
      await adminApi.addTimetableItem(payload);
      setStatus("Timetable row added.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleSaveTimetable = async (id, payload) => {
    try {
      await adminApi.updateTimetableItem(id, payload);
      setStatus("Timetable row updated.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleRemoveTimetable = async (id) => {
    try {
      await adminApi.removeTimetableItem(id);
      setStatus("Timetable row deleted.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleSaveMaterials = async (materials) => {
    try {
      await adminApi.updateMaterials(materials);
      setStatus("Study materials updated.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  return (
    <main className={PAGE_MAIN}>
      <Link href="/" className="inline-block w-fit font-bold text-teal-700 hover:underline">
        Back to Website
      </Link>

      <AdminLoginCard
        connected={connected}
        username={username}
        password={password}
        status={status}
        onUsernameChange={setUsername}
        onPasswordChange={setPassword}
        onLogin={login}
        onLogout={logout}
      />

      {connected ? (
        <>
          <section className="grid gap-4 rounded-xl border border-slate-300 bg-white p-4 max-md:p-3.5">
            <h2 className="text-xl font-extrabold text-slate-900">Portal Controls</h2>
            <p className="m-0 text-slate-600">Control page access and admission workflow from one secure dashboard.</p>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800">
                Notifications Page
                <input
                  type="checkbox"
                  checked={controls.notifications_page_enabled}
                  onChange={(event) =>
                    updateControlField(
                      { notifications_page_enabled: event.target.checked },
                      "Notifications page setting updated."
                    )
                  }
                />
              </label>

              <label className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800">
                Academics Page
                <input
                  type="checkbox"
                  checked={controls.academics_page_enabled}
                  onChange={(event) =>
                    updateControlField(
                      { academics_page_enabled: event.target.checked },
                      "Academics page setting updated."
                    )
                  }
                />
              </label>
            </div>

            <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <label className="flex items-center justify-between text-sm font-semibold text-slate-800">
                Admission Open
                <input
                  type="checkbox"
                  checked={controls.admission_open}
                  onChange={(event) =>
                    updateControlField({ admission_open: event.target.checked }, "Admission availability updated.")
                  }
                />
              </label>

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="admission-form-url">
                  Admission Google Form Link
                </label>
                <input
                  id="admission-form-url"
                  value={controls.admission_form_url}
                  onChange={(event) => setControls((prev) => ({ ...prev, admission_form_url: event.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
                  placeholder="https://forms.google.com/..."
                />
                <button
                  onClick={() =>
                    updateControlField(
                      { admission_form_url: controls.admission_form_url },
                      "Admission form link updated."
                    )
                  }
                  className="w-fit rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white"
                >
                  Save Form Link
                </button>
              </div>
            </div>
          </section>

          <NotificationsManager
            items={notificationItems}
            onAdd={handleAddNotification}
            onSave={handleSaveNotification}
            onRemove={handleRemoveNotification}
          />

          <AcademicsManager
            academicContent={academicContent}
            onAddNoticeboard={handleAddNoticeboard}
            onSaveNoticeboard={handleSaveNoticeboard}
            onRemoveNoticeboard={handleRemoveNoticeboard}
            onAddTimetable={handleAddTimetable}
            onSaveTimetable={handleSaveTimetable}
            onRemoveTimetable={handleRemoveTimetable}
            onSaveMaterials={handleSaveMaterials}
          />

          <EnquiriesManager contacts={contacts} onClearContacts={handleClearContacts} />
        </>
      ) : null}
    </main>
  );
}
