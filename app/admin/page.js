"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import AcademicsManager from "../components/admin/AcademicsManager";
import AdmissionsManager from "../components/admin/AdmissionsManager";
import AdminLoginCard from "../components/admin/AdminLoginCard";
import ControlsManager from "../components/admin/ControlsManager";
import DownloadsManager from "../components/admin/DownloadsManager";
import EnquiriesManager from "../components/admin/EnquiriesManager";
import FacultiesManager from "../components/admin/FacultiesManager";
import FacilitiesManager from "../components/admin/FacilitiesManager";
import InstituteDetailsManager from "../components/admin/InstituteDetailsManager";
import InstituteProfileManager from "../components/admin/InstituteProfileManager";
import MaterialsManager from "../components/admin/MaterialsManager";
import NoticesManager from "../components/admin/NoticesManager";
import NotificationsManager from "../components/admin/NotificationsManager";
import ProgramsManager from "../components/admin/ProgramsManager";
import StaffManager from "../components/admin/StaffManager";
import StreamsSubjectsManager from "../components/admin/StreamsSubjectsManager";
import StudentsManager from "../components/admin/StudentsManager";
import useAdminApi from "../hooks/useAdminApi";
import {
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
  notifications_page_enabled: true,
  academics_page_enabled: true,
  admission_open: true,
  admission_form_url: "",
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
  facilities: [],
  contact: {
    email: "",
    phone: "",
    address: "",
  },
};

const SECTIONS = [
  { id: "controls", label: "Site controls" },
  { id: "admissions", label: "Admissions" },
  { id: "profile", label: "Institute profile" },
  { id: "highlights", label: "Institute highlights" },
  { id: "programs", label: "Programs" },
  { id: "streams", label: "Streams & subjects" },
  { id: "faculty", label: "Faculty" },
  { id: "staff", label: "Staff" },
  { id: "facilities", label: "Facilities" },
  { id: "notices", label: "Quick notices" },
  { id: "downloads", label: "Downloads" },
  { id: "notifications", label: "Notifications" },
  { id: "academic-noticeboard", label: "Academic noticeboard" },
  { id: "materials", label: "Study materials" },
  { id: "students", label: "Student access" },
  { id: "enquiries", label: "Enquiries" },
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

  const adminApi = useAdminApi(token);

  const refreshDashboard = useCallback(async () => {
    if (!token) return;

    try {
      const data = await adminApi.loadDashboard();
      setNotificationItems(data.notificationItems || []);
      setContacts(data.contacts || []);
      setStudents(data.students || []);
      setAcademicContent({ ...defaultAcademicContent, ...(data.academicContent || {}) });
      setControls({ ...defaultControls, ...(data.controls || {}) });
      setNotices(data.notices || []);
      setDownloads(data.downloads || []);
      setAdmissions(data.admissions || []);
      setInstitute({
        ...defaultInstitute,
        ...(data.institute || {}),
        contact: { ...defaultInstitute.contact, ...(data.institute?.contact || {}) },
      });
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
    setStatus("Logging in...");
    try {
      const data = await adminApi.login(username, password);
      setToken(data.token);
      localStorage.setItem("admin_token", data.token);
      setPassword("");
      setStatus("Login successful.");
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
      const updated = await adminApi.updateControls(payload);
      setControls({ ...defaultControls, ...(updated || {}) });
      setStatus("Site controls updated.");
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const handleSaveInstitute = async (payload) => {
    try {
      const updated = await adminApi.updateInstitute(payload);
      setInstitute({
        ...defaultInstitute,
        ...(updated?.institute || updated || {}),
        contact: { ...defaultInstitute.contact, ...((updated?.institute || updated || {}).contact || {}) },
      });
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

  const handleSaveMaterials = async (materials) => {
    try {
      const updated = await adminApi.updateMaterials(materials);
      setAcademicContent((prev) => ({ ...prev, materials: updated.materials || materials }));
      setStatus("Study materials updated.");
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  const stats = useMemo(
    () => [
      { label: "Notifications", value: notificationItems.length },
      { label: "Quick notices", value: notices.length },
      { label: "Downloads", value: downloads.length },
      { label: "Enquiries", value: contacts.length },
      { label: "Students", value: students.length },
    ],
    [contacts.length, downloads.length, notificationItems.length, notices.length, students.length]
  );

  const activePane = useMemo(() => {
    switch (activeSection) {
      case "controls":
        return <ControlsManager controls={controls} onSave={handleSaveControls} />;
      case "admissions":
        return <AdmissionsManager admissions={admissions} onUpdate={handleUpdateAdmission} />;
      case "profile":
        return <InstituteProfileManager institute={institute} onSave={handleSaveInstitute} />;
      case "highlights":
        return (
          <InstituteDetailsManager
            details={institute.institute_details}
            onSave={(items) => handleSaveInstitute({ institute_details: items })}
          />
        );
      case "programs":
        return <ProgramsManager programs={institute.academics} onSave={(items) => handleSaveInstitute({ academics: items })} />;
      case "streams":
        return (
          <StreamsSubjectsManager
            streams={institute.streams_subjects}
            onSave={(items) => handleSaveInstitute({ streams_subjects: items })}
          />
        );
      case "faculty":
        return <FacultiesManager faculties={institute.faculties} onSave={(items) => handleSaveInstitute({ faculties: items })} />;
      case "staff":
        return <StaffManager staff={institute.staff} onSave={(items) => handleSaveInstitute({ staff: items })} />;
      case "facilities":
        return <FacilitiesManager facilities={institute.facilities} onSave={(items) => handleSaveInstitute({ facilities: items })} />;
      case "notices":
        return <NoticesManager notices={notices} onAdd={handleAddNotice} onSave={handleSaveNotice} onRemove={handleRemoveNotice} />;
      case "downloads":
        return <DownloadsManager downloads={downloads} onAdd={handleAddDownload} onSave={handleSaveDownload} onRemove={handleRemoveDownload} />;
      case "notifications":
        return (
          <NotificationsManager
            items={notificationItems}
            onAdd={handleAddNotification}
            onSave={handleSaveNotification}
            onRemove={handleRemoveNotification}
          />
        );
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
      case "enquiries":
        return <EnquiriesManager contacts={contacts} onClearContacts={handleClearContacts} />;
      default:
        return null;
    }
  }, [
    activeSection,
    academicContent,
    contacts,
    controls,
    downloads,
    handleAddDownload,
    handleAddNotice,
    handleAddNoticeboard,
    handleAddNotification,
    handleAddStudent,
    handleAddTimetable,
    handleClearContacts,
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
            onLogout={logout}
          />

          {connected ? (
            <>
              <section className={ADMIN_SECTION} id="overview">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className={ADMIN_SECTION_TITLE}>Overview</h2>
                  <span className={ADMIN_TAG}>Today</span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                  {stats.map((stat) => (
                    <article key={stat.label} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                        {stat.label}
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900">{stat.value}</p>
                    </article>
                  ))}
                </div>
              </section>

              <div className={ADMIN_NAV}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Navigate</p>
                  <button
                    type="button"
                    onClick={() => setActiveSection(SECTIONS[0].id)}
                    className={ADMIN_BUTTON_OUTLINE}
                  >
                    Reset
                  </button>
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



