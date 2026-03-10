"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import AdminLoginCard from "../components/admin/AdminLoginCard";
import DownloadsManager from "../components/admin/DownloadsManager";
import EnquiriesManager from "../components/admin/EnquiriesManager";
import NotificationsManager from "../components/admin/NotificationsManager";
import useAdminApi from "../hooks/useAdminApi";
import { PAGE_MAIN } from "../lib/uiClasses";

const toErrorMessage = (error) => String(error?.message || error);

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("admin_token") || "";
  });
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState("");
  const [notices, setNotices] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [newNotice, setNewNotice] = useState("");
  const [newDownloadTitle, setNewDownloadTitle] = useState("");
  const [newDownloadUrl, setNewDownloadUrl] = useState("");

  const adminApi = useAdminApi(token);

  const refreshDashboard = useCallback(async () => {
    if (!token) return;

    try {
      const data = await adminApi.loadDashboard();
      setNotices(data.notices);
      setContacts(data.contacts);
      setDownloads(data.downloads);
      setConnected(true);
      setStatus("Portal ready.");
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
    setNotices([]);
    setContacts([]);
    setDownloads([]);
    localStorage.removeItem("admin_token");
    setStatus("Logged out.");
  };

  const handleAddNotice = async () => {
    try {
      const text = newNotice.trim();
      if (!text) {
        setStatus("Please type a notice first.");
        return;
      }
      await adminApi.addNotice(text);
      setNewNotice("");
      setStatus("Notice added.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleRemoveNotice = async (noticeIndex) => {
    try {
      await adminApi.removeNotice(noticeIndex);
      setStatus("Notice removed.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleAddDownload = async () => {
    try {
      const title = newDownloadTitle.trim();
      const url = newDownloadUrl.trim();
      if (!title || !url) {
        setStatus("Please enter both title and file URL.");
        return;
      }
      await adminApi.addDownload(title, url);
      setNewDownloadTitle("");
      setNewDownloadUrl("");
      setStatus("Download item added.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleRemoveDownload = async (downloadIndex) => {
    try {
      await adminApi.removeDownload(downloadIndex);
      setStatus("Download item removed.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
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
          <NotificationsManager
            notices={notices}
            newNotice={newNotice}
            onNoticeChange={setNewNotice}
            onAddNotice={handleAddNotice}
            onRemoveNotice={handleRemoveNotice}
          />
          <DownloadsManager
            downloads={downloads}
            newDownloadTitle={newDownloadTitle}
            newDownloadUrl={newDownloadUrl}
            onTitleChange={setNewDownloadTitle}
            onUrlChange={setNewDownloadUrl}
            onAddDownload={handleAddDownload}
            onRemoveDownload={handleRemoveDownload}
          />
          <EnquiriesManager contacts={contacts} onClearContacts={handleClearContacts} />
        </>
      ) : null}
    </main>
  );
}
