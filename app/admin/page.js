"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AcademicsManager from "../components/admin/AcademicsManager";
import AdmissionsManager from "../components/admin/AdmissionsManager";
import AdminLoginCard from "../components/admin/AdminLoginCard";
import ControlsManager from "../components/admin/ControlsManager";
import DownloadsManager from "../components/admin/DownloadsManager";
import FacultiesManager from "../components/admin/FacultiesManager";
import InstituteDetailsManager from "../components/admin/InstituteDetailsManager";
import InstituteProfileManager from "../components/admin/InstituteProfileManager";
import MaterialsManager from "../components/admin/MaterialsManager";
import NoticesManager from "../components/admin/NoticesManager";
import NotificationsManager from "../components/admin/NotificationsManager";
import StreamsSubjectsManager from "../components/admin/StreamsSubjectsManager";
import StudentsManager from "../components/admin/StudentsManager";
import WebContentManager from "../components/admin/WebContentManager";
import useAdminApi from "../hooks/useAdminApi";
import {
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
  { id: "academic-noticeboard", label: "Academic noticeboard" },
  { id: "materials", label: "Study materials" },
  { id: "students", label: "Student access" },
];

const INSTITUTE_SUBSECTIONS = [
  { id: "profile", label: "1. Institute profile" },
  { id: "highlights", label: "2. Institute details" },
  { id: "streams", label: "3. Streams & subjects" },
  { id: "faculty", label: "4. Faculty & staff" },
  { id: "web-content", label: "5. Website content" },
];

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
  const [controls, setControls] = useState(defaultControls);
  const [notices, setNotices] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [institute, setInstitute] = useState(defaultInstitute);
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [activeInstituteSubsection, setActiveInstituteSubsection] = useState(
    INSTITUTE_SUBSECTIONS[0].id
  );
  const [dashboardRevision, setDashboardRevision] = useState(0);
  const [instituteRevision, setInstituteRevision] = useState(0);
  const [instituteLoaded, setInstituteLoaded] = useState(false);
  const adminApi = useAdminApi(token);
  const adminApiRef = useRef(adminApi);

  useEffect(() => {
    adminApiRef.current = adminApi;
  }, [adminApi]);

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
        localStorage.removeItem("admin_token");
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
  const login = async () => {
    setStatus("Logging in...");
    try {
      const data = await adminApi.login(username, password);
      if (!data?.token || typeof data.token !== "string") {
        throw new Error("Login did not return a valid session token.");
      }
      setToken(data.token);
      setConnected(true);
      localStorage.setItem("admin_token", data.token);
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

  const handleSaveControls = async (payload) => {
    try {
      await adminApi.updateControls(payload);
      await refreshDashboard();
      setStatus("Site controls updated.");
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleSaveInstitute = async (payload) => {
    try {
      await adminApi.updateInstitute(payload);
      await refreshInstitute();
      setStatus("Institute content updated.");
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleAddNotice = async (payload) => {
    try {
      await adminApi.addNotice(payload);
      setStatus("Notice added.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleSaveNotice = async (index, payload) => {
    try {
      await adminApi.updateNotice(index, payload);
      setStatus("Notice updated.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleRemoveNotice = async (index) => {
    try {
      await adminApi.removeNotice(index);
      setStatus("Notice removed.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleAddDownload = async (payload) => {
    try {
      await adminApi.addDownload(payload);
      setStatus("Download item added.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleSaveDownload = async (index, payload) => {
    try {
      await adminApi.updateDownload(index, payload);
      setStatus("Download item updated.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleRemoveDownload = async (index) => {
    try {
      await adminApi.removeDownload(index);
      setStatus("Download item removed.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleUpdateAdmission = async (applicationId, payload) => {
    try {
      await adminApi.updateAdmission(applicationId, payload);
      setStatus("Admission status updated.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };


  const handleDeleteAdmission = async (applicationId) => {
    try {
      await adminApi.removeAdmission(applicationId);
      setStatus("Admission form deleted.");
      await refreshDashboard();
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };
  const handleSaveMaterials = async (materials) => {
    try {
      await adminApi.updateMaterials(materials);
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
              <WebContentManager key={`institute-${instituteRevision}-web`} institute={institute} onSave={handleSaveInstitute} />
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
    institute,
    notices,
    notificationItems,
    students,
  ]);

  return (
    <main className={`${ADMIN_PAGE} admin-root`}>
      <div className={ADMIN_CONTAINER}>
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Administration</p>
            <h1 className="text-2xl font-semibold text-slate-900">School Management Console</h1>
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

        <div className="mt-6 grid gap-6 min-w-0 max-w-full overflow-x-hidden">
          <AdminLoginCard
            connected={connected}
            username={username}
            password={password}
            status={status}
            onUsernameChange={setUsername}
            onPasswordChange={setPassword}
            onLogin={login}
          />

          {connected ? (
            <>
              <div className={ADMIN_NAV}>                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Navigate</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveSection(SECTIONS[0].id)}
                      className={ADMIN_BUTTON_OUTLINE}
                    >
                      Reset
                    </button>
                  </div>
                </div>
                <label className="mt-3 grid gap-2" htmlFor="admin-section-select">
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
              </div>

              <div className="min-w-0 max-w-full overflow-hidden">{activePane}</div>
            </>
          ) : null}
        </div>
      </div>
    </main>
  );
}





















