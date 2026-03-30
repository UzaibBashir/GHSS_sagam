"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AcademicsManager from "../components/admin/AcademicsManager";
import AdmissionsManager from "../components/admin/AdmissionsManager";
import AdminLoginCard from "../components/admin/AdminLoginCard";
import BackupsManager from "../components/admin/BackupsManager";
import ControlsManager from "../components/admin/ControlsManager";
import DownloadsManager from "../components/admin/DownloadsManager";
import FacultiesManager from "../components/admin/FacultiesManager";
import InstituteDetailsManager from "../components/admin/InstituteDetailsManager";
import InstituteProfileManager from "../components/admin/InstituteProfileManager";
import MaterialsManager from "../components/admin/MaterialsManager";
import NoticesManager from "../components/admin/NoticesManager";
import NotificationsManager from "../components/admin/NotificationsManager";
import MonitoringManager from "../components/admin/MonitoringManager";
import StreamsSubjectsManager from "../components/admin/StreamsSubjectsManager";
import StudentsManager from "../components/admin/StudentsManager";
import WebContentManager from "../components/admin/WebContentManager";
import LoadingSpinner from "../components/common/LoadingSpinner";
import useAdminApi from "../hooks/useAdminApi";
import {
  ADMIN_BUTTON,
  ADMIN_BUTTON_DANGER,
  ADMIN_BUTTON_OUTLINE,
  ADMIN_CONTAINER,
  ADMIN_INPUT,
  ADMIN_LABEL,
  ADMIN_NAV,
  ADMIN_PAGE,
  ADMIN_SECTION,
  ADMIN_SECTION_TITLE,
  ADMIN_TAG,
} from "../components/admin/adminStyles";

const toErrorMessage = (error) => String(error?.message || error);

const ADMIN_TOKEN_KEY = "admin_token";
const ADMIN_TOKEN_EXPIRY_KEY = "admin_token_expiry";

function readStoredAdminToken() {
  if (typeof window === "undefined") return "";

  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY) || "";
  const expiresAt = Number(sessionStorage.getItem(ADMIN_TOKEN_EXPIRY_KEY) || 0);

  if (!token) {
    return "";
  }

  if (Number.isFinite(expiresAt) && expiresAt > 0 && Date.now() > expiresAt) {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_TOKEN_EXPIRY_KEY);
    return "";
  }

  return token;
}


const defaultAcademicContent = {
  noticeboard: [],
  timetable: [],
  materials: [],
};

const defaultControls = {
  about_page_enabled: true,
  notifications_page_enabled: true,
  academics_page_enabled: true,
  admission_page_enabled: true,
  admission_apply_page_enabled: true,
  admission_status_page_enabled: true,
  contact_page_enabled: true,
  admission_open: true,
};

const defaultInstitute = {
  name: "",
  tagline: "",
  description: "",
  about_us: "",
  institute_details: [],
  academics: [],
  faculties: [],
  streams_subjects: [],
  staff: [],
  principal: { name: "", role: "Principal", message: "", photo: "" },
  facilities: [],
  contact: {
    email: "",
    phone: "",
    address: "",
  },
  hero_slides: [],
  home_highlights: { stats: [], reasons: [] },
  home_front_desk: { title: "", items: [] },
  home_achievements: [],
  home_student_achievements: [],
  home_resources: [],
  home_testimonials: [],
  admission_content: { sessionYear: "2026", guidelines: [], eligibility: [], requiredDocuments: [] },
};

const SECTIONS = [
  { id: "controls", label: "Site controls" },
  { id: "admissions", label: "Admissions" },
  { id: "institute", label: "Institute content" },
  { id: "announcements", label: "Notices & notifications" },
  { id: "downloads", label: "Downloads" },
  { id: "academic-noticeboard", label: "Academic noticeboard" },
  { id: "materials", label: "Study materials" },
  { id: "students", label: "Student access" },
  { id: "monitoring", label: "Monitoring" },
  { id: "backups", label: "Backup and restore" },
];

const INSTITUTE_SUBSECTIONS = [
  { id: "slideshow", label: "1. Homepage slideshow" },
  { id: "profile", label: "2. Institute profile" },
  { id: "highlights", label: "3. Institute details" },
  { id: "streams", label: "4. Streams & subjects" },
  { id: "faculty", label: "5. Faculty & staff" },
  { id: "web-content", label: "6. Website content" },
];

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(() => readStoredAdminToken());
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState("");
  const [notificationItems, setNotificationItems] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [students, setStudents] = useState([]);
  const [academicContent, setAcademicContent] = useState(defaultAcademicContent);
  const [controls, setControls] = useState(defaultControls);
  const [notices, setNotices] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [institute, setInstitute] = useState(defaultInstitute);
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [busy, setBusy] = useState(false);
  const [busyMessage, setBusyMessage] = useState("");
  const [confirmState, setConfirmState] = useState(null);
  const [monitoring, setMonitoring] = useState({
    api: { count: 0, p50: 0, p95: 0, latest: [] },
    webVitals: { count: 0, latest: [] },
  });
  const [backups, setBackups] = useState([]);
  const [activeInstituteSubsection, setActiveInstituteSubsection] = useState(
    INSTITUTE_SUBSECTIONS[0].id
  );

  const [dashboardRevision, setDashboardRevision] = useState(0);
  const [instituteRevision, setInstituteRevision] = useState(0);
  const [instituteLoaded, setInstituteLoaded] = useState(false);
  const adminApi = useAdminApi(token);
  const adminApiRef = useRef(adminApi);
  const isStatusError = useMemo(
    () => /error|failed|invalid|denied|unauthorized|forbidden/i.test(status),
    [status]
  );

  useEffect(() => {
    adminApiRef.current = adminApi;
  }, [adminApi]);

  const runWithBusy = useCallback(async (message, task) => {
    setBusy(true);
    setBusyMessage(message);
    try {
      return await task();
    } finally {
      setBusy(false);
      setBusyMessage("");
    }
  }, []);

  const requestConfirmation = useCallback((message, confirmLabel = "Confirm changes") => {
    return new Promise((resolve) => {
      setConfirmState({
        message,
        confirmLabel,
        resolve,
      });
    });
  }, []);

  const closeConfirmation = useCallback((confirmed) => {
    setConfirmState((current) => {
      if (current?.resolve) {
        current.resolve(Boolean(confirmed));
      }
      return null;
    });
  }, []);

  const runWithConfirmedBusy = useCallback(
    async (message, task, confirmMessage = "Please confirm to apply this update.") => {
      const confirmed = await requestConfirmation(confirmMessage);
      if (!confirmed) {
        setStatus("Action cancelled.");
        return null;
      }
      return runWithBusy(message, task);
    },
    [requestConfirmation, runWithBusy]
  );

  const refreshDashboard = useCallback(async () => {
    if (!token) return;

    try {
      const data = await adminApiRef.current.loadDashboard();
      setNotificationItems(data.notificationItems || []);
      setContacts(data.contacts || []);
      setStudents(data.students || []);
      setAcademicContent({ ...defaultAcademicContent, ...(data.academicContent || {}) });
      setControls({ ...defaultControls, ...(data.controls || {}) });
      setNotices(data.notices || []);
      setDownloads(data.downloads || []);
      setAdmissions(data.admissions || []);
      if (data.institute) {
        setInstitute({
          ...defaultInstitute,
          ...(data.institute || {}),
          contact: { ...defaultInstitute.contact, ...(data.institute?.contact || {}) },
        });
        setInstituteLoaded(true);
        setInstituteRevision((prev) => prev + 1);
      }
      setDashboardRevision((prev) => prev + 1);
      setConnected(true);
      setStatus("Secure portal ready.");
    } catch (error) {
      if (error?.status === 401 || error?.status === 403) {
        setConnected(false);
        setToken("");
        sessionStorage.removeItem(ADMIN_TOKEN_KEY);
        sessionStorage.removeItem(ADMIN_TOKEN_EXPIRY_KEY);
      } else {
        setConnected(true);
      }
      setStatus(toErrorMessage(error));
    }
  }, [token]);

  const refreshInstitute = useCallback(async () => {
    if (!token) return;

    try {
      const instituteData = await adminApiRef.current.loadInstitute();
      setInstitute({
        ...defaultInstitute,
        ...(instituteData || {}),
        contact: { ...defaultInstitute.contact, ...(instituteData?.contact || {}) },
      });
      setInstituteLoaded(true);
      setInstituteRevision((prev) => prev + 1);
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  }, [token]);

  const refreshMonitoring = useCallback(async () => {
    if (!token) return;

    try {
      const data = await adminApiRef.current.loadMonitoring();
      setMonitoring(data || { api: { count: 0, p50: 0, p95: 0, latest: [] }, webVitals: { count: 0, latest: [] } });
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  }, [token]);

  const refreshBackups = useCallback(async () => {
    if (!token) return;

    try {
      const data = await adminApiRef.current.loadBackups();
      setBackups(Array.isArray(data) ? data : []);
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  }, [token]);
  useEffect(() => {
    if (!token) return;
    const timer = setTimeout(() => {
      refreshDashboard();
    }, 0);
    return () => clearTimeout(timer);
  }, [token, refreshDashboard]);
  useEffect(() => {
    if (!connected) return;
    if (activeSection !== "institute") return;
    if (instituteLoaded) return;
    refreshInstitute();
  }, [connected, activeSection, instituteLoaded, refreshInstitute]);
  useEffect(() => {
    if (!connected) return;
    if (activeSection !== "monitoring") return;
    refreshMonitoring();
  }, [connected, activeSection, refreshMonitoring]);
  useEffect(() => {
    if (!connected) return;
    if (activeSection !== "backups") return;
    refreshBackups();
  }, [connected, activeSection, refreshBackups]);
  const login = async () => {
    setStatus("Logging in...");
    try {
      const data = await runWithBusy("Signing in...", () => adminApi.login(username, password));
      if (!data?.token || typeof data.token !== "string") {
        throw new Error("Login did not return a valid session token.");
      }
      setToken(data.token);
      setConnected(true);
      sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      const expiresInSeconds = Number(data.expires_in || 0);
      if (Number.isFinite(expiresInSeconds) && expiresInSeconds > 0) {
        sessionStorage.setItem(ADMIN_TOKEN_EXPIRY_KEY, String(Date.now() + expiresInSeconds * 1000));
      }
      setPassword("");
      setStatus("Login successful. Loading dashboard...");
    } catch (error) {
      setConnected(false);
      setStatus(`Login failed: ${toErrorMessage(error)}`);
    }
  };

  const logout = () => {
    setToken("");
    setConnected(false);
    setNotificationItems([]);
    setContacts([]);
    setStudents([]);
    setAcademicContent(defaultAcademicContent);
    setControls(defaultControls);
    setNotices([]);
    setDownloads([]);
    setAdmissions([]);
    setInstitute(defaultInstitute);
    setInstituteLoaded(false);
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_TOKEN_EXPIRY_KEY);
    setStatus("Logged out.");
  };

  const handleClearContacts = async () => {
    try {
      await runWithConfirmedBusy("Clearing enquiries...", () => adminApi.clearContacts());
      setContacts([]);
      setStatus("All enquiries cleared.");
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleCreateBackup = async (label) => {
    try {
      await runWithConfirmedBusy("Creating snapshot...", () => adminApi.createBackup(label));
      await refreshBackups();
      setStatus("Snapshot created.");
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleRestoreBackup = async (id) => {
    try {
      await runWithConfirmedBusy("Restoring snapshot...", async () => {
        await adminApi.restoreBackup(id);
        await refreshDashboard();
        await refreshInstitute();
      });
      await refreshBackups();
      setStatus("Snapshot restored.");
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleDeleteBackup = async (id) => {
    try {
      await runWithConfirmedBusy("Deleting snapshot...", () => adminApi.removeBackup(id));
      await refreshBackups();
      setStatus("Snapshot deleted.");
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleAddStudent = async (payload) => {
    try {
      await runWithConfirmedBusy("Adding student login...", () => adminApi.addStudent(payload));
      setStatus("Student login added.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleSaveStudent = async (rollNumber, payload) => {
    try {
      await runWithConfirmedBusy("Updating student login...", () => adminApi.updateStudent(rollNumber, payload));
      setStatus("Student login updated.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleRemoveStudent = async (rollNumber) => {
    try {
      await runWithConfirmedBusy("Removing student login...", () => adminApi.removeStudent(rollNumber));
      setStatus("Student login removed.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleAddNotification = async (payload) => {
    try {
      await runWithConfirmedBusy("Publishing notification...", () => adminApi.addNotificationItem(payload));
      setStatus("Notification added.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleSaveNotification = async (id, payload) => {
    try {
      await runWithConfirmedBusy("Updating notification...", () => adminApi.updateNotificationItem(id, payload));
      setStatus("Notification updated.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleRemoveNotification = async (id) => {
    try {
      await runWithConfirmedBusy("Deleting notification...", () => adminApi.removeNotificationItem(id));
      setStatus("Notification deleted.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleAddNoticeboard = async (payload) => {
    try {
      await runWithConfirmedBusy("Adding noticeboard item...", () => adminApi.addNoticeboardItem(payload));
      setStatus("Noticeboard item added.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleSaveNoticeboard = async (id, payload) => {
    try {
      await runWithConfirmedBusy("Updating noticeboard item...", () => adminApi.updateNoticeboardItem(id, payload));
      setStatus("Noticeboard item updated.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleRemoveNoticeboard = async (id) => {
    try {
      await runWithConfirmedBusy("Deleting noticeboard item...", () => adminApi.removeNoticeboardItem(id));
      setStatus("Noticeboard item deleted.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleAddTimetable = async (payload) => {
    try {
      await runWithConfirmedBusy("Adding timetable row...", () => adminApi.addTimetableItem(payload));
      setStatus("Timetable row added.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleSaveTimetable = async (id, payload) => {
    try {
      await runWithConfirmedBusy("Updating timetable row...", () => adminApi.updateTimetableItem(id, payload));
      setStatus("Timetable row updated.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleRemoveTimetable = async (id) => {
    try {
      await runWithConfirmedBusy("Deleting timetable row...", () => adminApi.removeTimetableItem(id));
      setStatus("Timetable row deleted.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleSaveControls = async (payload) => {
    try {
      await runWithConfirmedBusy("Updating site controls...", () => adminApi.updateControls(payload));
      await refreshDashboard();
      setStatus("Site controls updated.");
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleSaveInstitute = async (payload) => {
    try {
      await runWithConfirmedBusy("Saving institute content...", () => adminApi.updateInstitute(payload));
      await refreshInstitute();
      setStatus("Institute content updated.");
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleAddNotice = async (payload) => {
    try {
      await runWithConfirmedBusy("Adding notice...", () => adminApi.addNotice(payload));
      setStatus("Notice added.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleSaveNotice = async (index, payload) => {
    try {
      await runWithConfirmedBusy("Updating notice...", () => adminApi.updateNotice(index, payload));
      setStatus("Notice updated.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleRemoveNotice = async (index) => {
    try {
      await runWithConfirmedBusy("Removing notice...", () => adminApi.removeNotice(index));
      setStatus("Notice removed.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleAddDownload = async (payload) => {
    try {
      await runWithConfirmedBusy("Adding download item...", () => adminApi.addDownload(payload));
      setStatus("Download item added.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleSaveDownload = async (index, payload) => {
    try {
      await runWithConfirmedBusy("Updating download item...", () => adminApi.updateDownload(index, payload));
      setStatus("Download item updated.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleRemoveDownload = async (index) => {
    try {
      await runWithConfirmedBusy("Removing download item...", () => adminApi.removeDownload(index));
      setStatus("Download item removed.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleUpdateAdmission = async (applicationId, payload) => {
    try {
      await runWithConfirmedBusy("Updating admission status...", () => adminApi.updateAdmission(applicationId, payload));
      setStatus("Admission status updated.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };


  const handleDeleteAdmission = async (applicationId) => {
    try {
      await runWithConfirmedBusy("Deleting admission form...", () => adminApi.removeAdmission(applicationId));
      setStatus("Admission form deleted.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };
  const handleSaveMaterials = async (materials) => {
    try {
      await runWithConfirmedBusy("Saving study materials...", () => adminApi.updateMaterials(materials));
      await refreshDashboard();
      setStatus("Study materials updated.");
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const activePane = useMemo(() => {
    switch (activeSection) {
      case "controls":
        return <ControlsManager key={`controls-${dashboardRevision}`} controls={controls} onSave={handleSaveControls} />;
      case "admissions":
        return <AdmissionsManager admissions={admissions} onUpdate={handleUpdateAdmission} onDelete={handleDeleteAdmission} />;
      case "institute":
        return (
          <div className="grid gap-6">
            <article className={ADMIN_NAV}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Institute Sub Navigation</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {INSTITUTE_SUBSECTIONS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={activeInstituteSubsection === item.id ? ADMIN_BUTTON_DANGER : ADMIN_BUTTON_OUTLINE}
                    onClick={() => setActiveInstituteSubsection(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </article>
            {activeInstituteSubsection === "slideshow" ? (
              <WebContentManager key={`institute-${instituteRevision}-slideshow`} institute={institute} onSave={handleSaveInstitute} view="slideshow" />
            ) : null}
            {activeInstituteSubsection === "profile" ? (
              <InstituteProfileManager key={`institute-${instituteRevision}-profile`} institute={institute} onSave={handleSaveInstitute} />
            ) : null}
            {activeInstituteSubsection === "highlights" ? (
              <InstituteDetailsManager
                key={`institute-${instituteRevision}-highlights`}
                details={institute.institute_details}
                onSave={(items) => handleSaveInstitute({ institute_details: items })}
              />
            ) : null}
            {activeInstituteSubsection === "streams" ? (
              <StreamsSubjectsManager
                key={`institute-${instituteRevision}-streams`}
                programs={institute.academics}
                onSavePrograms={(items) => handleSaveInstitute({ academics: items })}
                streams={institute.streams_subjects}
                onSave={(items) => handleSaveInstitute({ streams_subjects: items })}
              />
            ) : null}
            {activeInstituteSubsection === "faculty" ? (
              <FacultiesManager
                key={`institute-${instituteRevision}-faculty`}
                faculties={institute.faculties}
                onSave={(items) => handleSaveInstitute({ faculties: items })}
                staff={institute.staff}
                onSaveStaff={(items) => handleSaveInstitute({ staff: items })}
                principal={institute.principal}
                onSavePrincipal={(item) => handleSaveInstitute({ principal: item })}
              />
            ) : null}
            {activeInstituteSubsection === "web-content" ? (
              <WebContentManager key={`institute-${instituteRevision}-web`} institute={institute} onSave={handleSaveInstitute} view="content" />
            ) : null}
          </div>
        );
      case "announcements":
        return (
          <div className="grid gap-6">
            <NoticesManager notices={notices} onAdd={handleAddNotice} onSave={handleSaveNotice} onRemove={handleRemoveNotice} />
            <NotificationsManager
              items={notificationItems}
              onAdd={handleAddNotification}
              onSave={handleSaveNotification}
              onRemove={handleRemoveNotification}
            />
          </div>
        );
      case "downloads":
        return <DownloadsManager downloads={downloads} onAdd={handleAddDownload} onSave={handleSaveDownload} onRemove={handleRemoveDownload} />;
      case "academic-noticeboard":
        return (
          <AcademicsManager
            academicContent={academicContent}
            onAddNoticeboard={handleAddNoticeboard}
            onSaveNoticeboard={handleSaveNoticeboard}
            onRemoveNoticeboard={handleRemoveNoticeboard}
            onAddTimetable={handleAddTimetable}
            onSaveTimetable={handleSaveTimetable}
            onRemoveTimetable={handleRemoveTimetable}
          />
        );
      case "materials":
        return <MaterialsManager materials={academicContent.materials} onSave={handleSaveMaterials} />;
      case "students":
        return (
          <StudentsManager
            students={students}
            onAdd={handleAddStudent}
            onSave={handleSaveStudent}
            onRemove={handleRemoveStudent}
          />
        );
      case "monitoring":
        return <MonitoringManager monitoring={monitoring} onRefresh={refreshMonitoring} loading={busy} />;
      case "backups":
        return (
          <BackupsManager
            backups={backups}
            onCreate={handleCreateBackup}
            onRestore={handleRestoreBackup}
            onDelete={handleDeleteBackup}
            loading={busy}
          />
        );
      default:
        return null;
    }  }, [
    activeSection,
    activeInstituteSubsection,
    academicContent,
    admissions,
    controls,
    downloads,
    handleAddDownload,
    handleAddNotice,
    handleAddNoticeboard,
    handleAddNotification,
    handleAddStudent,
    handleAddTimetable,
    handleRemoveDownload,
    handleRemoveNotice,
    handleRemoveNoticeboard,
    handleRemoveNotification,
    handleRemoveStudent,
    handleRemoveTimetable,
    handleSaveControls,
    handleSaveDownload,
    handleSaveInstitute,
    handleSaveMaterials,
    handleUpdateAdmission,
    handleDeleteAdmission,
    handleSaveNotice,
    handleSaveNoticeboard,
    handleSaveNotification,
    handleSaveStudent,
    handleSaveTimetable,
    dashboardRevision,
    instituteRevision,
    institute,
    notices,
    notificationItems,
    students,
    monitoring,
    backups,
    busy,
    refreshMonitoring,
    handleCreateBackup,
    handleRestoreBackup,
    handleDeleteBackup,
  ]);
  const activeSectionLabel = useMemo(
    () => SECTIONS.find((item) => item.id === activeSection)?.label || "Section",
    [activeSection]
  );

  return (
    <main className={`${ADMIN_PAGE} admin-root`}>
      <div className={ADMIN_CONTAINER}>
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Administration</p>
            <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">School Management Console</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400"
            >
              Back to website
            </Link>
            {connected ? <span className={ADMIN_TAG}>Session active</span> : <span className={ADMIN_TAG}>Sign in required</span>}
            {connected ? (
              <button type="button" onClick={logout} className={ADMIN_BUTTON_DANGER}>
                Sign out
              </button>
            ) : null}
          </div>
        </header>

        <div className="mt-4 grid gap-4 min-w-0 max-w-full overflow-x-hidden sm:mt-5">
          {!connected ? (
            <AdminLoginCard
              connected={connected}
              username={username}
              password={password}
              status={status}
              loading={busy}
              onUsernameChange={setUsername}
              onPasswordChange={setPassword}
              onLogin={login}
            />
          ) : null}

          {connected ? (
            <>
              <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start">
                <aside className={`${ADMIN_NAV} lg:sticky lg:top-4`}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Navigation</p>
                    <button
                      type="button"
                      onClick={() => setActiveSection(SECTIONS[0].id)}
                      className={ADMIN_BUTTON_OUTLINE}
                    >
                      Reset
                    </button>
                  </div>
                  <label className="mt-3 grid gap-2 lg:hidden" htmlFor="admin-section-select">
                    <span className={ADMIN_LABEL}>Select section</span>
                    <select
                      id="admin-section-select"
                      className={ADMIN_INPUT}
                      value={activeSection}
                      onChange={(event) => setActiveSection(event.target.value)}
                    >
                      {SECTIONS.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <nav className="mt-3 hidden lg:grid lg:gap-2">
                    {SECTIONS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveSection(item.id)}
                        className={
                          activeSection === item.id
                            ? "rounded-md border border-slate-900 bg-slate-900 px-3 py-2 text-left text-sm font-semibold text-white"
                            : "rounded-md border border-slate-200 bg-white px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        }
                      >
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </aside>

                <section className="min-w-0 space-y-4">
                  {status ? (
                    <div
                      className={`rounded-lg border px-4 py-3 text-sm ${
                        isStatusError
                          ? "border-rose-200 bg-rose-50 text-rose-800"
                          : "border-emerald-200 bg-emerald-50 text-emerald-800"
                      }`}
                    >
                      <strong>{isStatusError ? "Action failed:" : "Action successful:"}</strong> {status}
                    </div>
                  ) : null}
                  <section className={ADMIN_SECTION}>
                    <h2 className={ADMIN_SECTION_TITLE}>{activeSectionLabel}</h2>
                    <p className="mt-1 text-sm text-slate-600">Use the form below to update records and save changes.</p>
                  </section>
                  <div className="min-w-0 max-w-full overflow-hidden">{activePane}</div>
                </section>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {confirmState ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
          <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-2xl">
            <p className="text-base font-semibold text-slate-900">Confirm update</p>
            <p className="mt-2 text-sm text-slate-600">{confirmState.message}</p>
            <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
              <button type="button" className={ADMIN_BUTTON_OUTLINE} onClick={() => closeConfirmation(false)}>
                Cancel
              </button>
              <button type="button" className={ADMIN_BUTTON} onClick={() => closeConfirmation(true)}>
                {confirmState.confirmLabel || "Confirm changes"}
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {busy ? (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-md">
          <section className="w-full max-w-sm rounded-xl border border-slate-200 bg-white/95 p-5 shadow-2xl">
            <LoadingSpinner label={busyMessage || "Applying update..."} />
            <p className="mt-2 text-center text-sm font-medium text-slate-700">Please wait while your changes are being applied.</p>
          </section>
        </div>
      ) : null}
    </main>
  );
}





















