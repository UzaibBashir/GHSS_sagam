"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import AcademicsManager from "../components/admin/AcademicsManager";
import AdminLoginCard from "../components/admin/AdminLoginCard";
import EnquiriesManager from "../components/admin/EnquiriesManager";
import NotificationsManager from "../components/admin/NotificationsManager";
import StudentsManager from "../components/admin/StudentsManager";
import useAdminApi from "../hooks/useAdminApi";
import { PAGE_MAIN } from "../lib/uiClasses";

const toErrorMessage = (error) => String(error?.message || error);

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
  const [students, setStudents] = useState([]);
  const [academicContent, setAcademicContent] = useState(defaultAcademicContent);

  const adminApi = useAdminApi(token);

  const refreshDashboard = useCallback(async () => {
    if (!token) return;

    try {
      const data = await adminApi.loadDashboard();
      setNotificationItems(data.notificationItems || []);
      setContacts(data.contacts || []);
      setStudents(data.students || []);
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
    setStudents([]);
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

  const handleAddStudent = async (payload) => {
    try {
      await adminApi.addStudent(payload);
      setStatus("Student login added.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleSaveStudent = async (rollNumber, payload) => {
    try {
      await adminApi.updateStudent(rollNumber, payload);
      setStatus("Student login updated.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleRemoveStudent = async (rollNumber) => {
    try {
      await adminApi.removeStudent(rollNumber);
      setStatus("Student login removed.");
      await refreshDashboard();
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

  return (
    <main className={PAGE_MAIN}>
      <Link href="/" className="inline-block w-fit text-sm font-bold text-teal-700 hover:underline">
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
        <div className="grid gap-6 max-sm:gap-4">
          <StudentsManager
            students={students}
            onAdd={handleAddStudent}
            onSave={handleSaveStudent}
            onRemove={handleRemoveStudent}
          />

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
          />

          <EnquiriesManager contacts={contacts} onClearContacts={handleClearContacts} />
        </div>
      ) : null}
    </main>
  );
}
