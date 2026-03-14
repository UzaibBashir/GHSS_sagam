"use client";

import { useEffect, useState } from "react";
import AcademicsSection from "../components/home/AcademicsSection";
import CallToActionBanner from "../components/common/CallToActionBanner";
import PageHero from "../components/common/PageHero";
import Navbar from "../components/layout/Navbar";
import useInstituteData from "../hooks/useInstituteData";
import { API_BASE } from "../lib/api";
import { INPUT, PAGE_MAIN, PRIMARY_BUTTON } from "../lib/uiClasses";

const STORAGE_KEY = "ghhs_student_token";
const CLASS_OPTIONS = ["Class XI", "Class XII"];
const STREAM_OPTIONS = ["Medical", "Non-Medical", "Arts"];

async function fetchStudentSession(token, signal) {
  const response = await fetch(`${API_BASE}/student/session`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.detail || "Session expired. Please login again.");
  }

  return data.student;
}

async function fetchAcademicContent(token, signal) {
  const response = await fetch(`${API_BASE}/student/academics/content`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.detail || "Unable to load academic content.");
  }

  return data;
}

export default function AcademicsPage() {
  const { institute } = useInstituteData();
  const controls = institute?.site_controls;
  const academicsEnabled = controls?.academics_page_enabled ?? true;

  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [className, setClassName] = useState(CLASS_OPTIONS[0]);
  const [stream, setStream] = useState(STREAM_OPTIONS[0]);
  const [status, setStatus] = useState("");
  const [student, setStudent] = useState(null);
  const [academicData, setAcademicData] = useState(null);

  useEffect(() => {
    let isActive = true;
    const token = window.sessionStorage.getItem(STORAGE_KEY);

    if (!token) {
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    Promise.all([fetchStudentSession(token, controller.signal), fetchAcademicContent(token, controller.signal)])
      .then(([studentData, contentData]) => {
        if (!isActive) return;
        setStudent(studentData);
        setAcademicData(contentData.academic_content || null);
        setClassName(studentData.className || CLASS_OPTIONS[0]);
        setStream(studentData.stream || STREAM_OPTIONS[0]);
        setStatus("");
      })
      .catch(() => {
        if (!isActive) return;
        window.sessionStorage.removeItem(STORAGE_KEY);
        setStudent(null);
        setAcademicData(null);
      })
      .finally(() => {
        clearTimeout(timeoutId);
      });

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setStatus("Verifying your academic access...");

    try {
      const response = await fetch(`${API_BASE}/student/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber, password, className, stream }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.detail || "Invalid login details");
      }

      window.sessionStorage.setItem(STORAGE_KEY, data.token);
      const contentData = await fetchAcademicContent(data.token);
      setStudent(data.student);
      setAcademicData(contentData.academic_content || null);
      setClassName(data.student.className || className);
      setStream(data.student.stream || stream);
      setStatus("Academic access granted.");
      setPassword("");
    } catch (error) {
      setStudent(null);
      setAcademicData(null);
      setStatus(error.message || "Login failed");
    }
  };

  const handleLogout = () => {
    window.sessionStorage.removeItem(STORAGE_KEY);
    setStudent(null);
    setAcademicData(null);
    setRollNumber("");
    setPassword("");
    setClassName(CLASS_OPTIONS[0]);
    setStream(STREAM_OPTIONS[0]);
    setStatus("You have been logged out.");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className={PAGE_MAIN}>
        <PageHero
          eyebrow="Academic Life"
          title="Structured higher secondary learning across Medical, Non-Medical, and Arts"
          description="Students can sign in with their roll number, class, stream, and password to access academic notices, timetables, and study materials prepared for their section."
          stats={[
            { value: "3", label: "Streams Offered" },
            { value: "XI-XII", label: "Classes Supported" },
            { value: "Secure", label: "Student Login Access" },
            { value: "Guided", label: "Study Support" },
          ]}
          actions={[
            { label: "Explore Admission", href: "/admission" },
            { label: "Contact Front Desk", href: "/about#contact", variant: "secondary" },
          ]}
        />

        {!academicsEnabled ? (
          <section className="rounded-[2rem] border border-amber-300/70 bg-amber-50/90 p-6 text-amber-900 shadow-[0_18px_36px_rgba(217,119,6,0.12)]">
            <h1 className="text-xl font-extrabold">Academics Page Disabled</h1>
            <p className="mt-2 text-sm">This page is currently disabled by the administrator.</p>
          </section>
        ) : !student ? (
          <section id="student-login">
            <article className="glass-panel rounded-[2rem] border border-white/75 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] max-md:p-4 max-sm:rounded-[1.4rem]">
              <p className="text-[0.7rem] font-extrabold tracking-[0.16em] text-amber-700 uppercase">Student Login</p>
              <h2 className="font-display mt-4 text-3xl font-semibold text-slate-950 max-md:text-2xl max-sm:text-[1.4rem]">
                Academic materials are available after student sign-in
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 max-sm:text-[0.85rem] max-sm:leading-6">
                Enter the assigned roll number, choose your class and stream, and then provide the password issued by the school.
              </p>
              <div className="mt-4 rounded-[1.2rem] border border-amber-200/70 bg-amber-50/80 p-4 text-sm text-amber-900 max-sm:p-3">
                <p className="font-bold">Access note</p>
                <p className="mt-2 leading-6 max-sm:text-[0.85rem]">
                  If a student has not yet received login details, please contact the school office or use the About page contact section for assistance.
                </p>
              </div>

              <div className="mt-6">
                <p className="section-kicker">Login Form</p>
                <h3 className="font-display mt-4 text-3xl font-semibold text-slate-950 max-md:text-2xl max-sm:text-[1.35rem]">Sign in to continue</h3>
                <form className="mt-6 grid gap-3" onSubmit={handleLogin}>
                  <input
                    value={rollNumber}
                    onChange={(event) => setRollNumber(event.target.value)}
                    placeholder="Roll Number"
                    className={INPUT}
                    required
                  />
                  <div className="grid gap-3 md:grid-cols-2">
                    <select
                      value={className}
                      onChange={(event) => setClassName(event.target.value)}
                      className={INPUT}
                    >
                      {CLASS_OPTIONS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <select
                      value={stream}
                      onChange={(event) => setStream(event.target.value)}
                      className={INPUT}
                    >
                      {STREAM_OPTIONS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password"
                    className={INPUT}
                    required
                  />
                  <button type="submit" className={`${PRIMARY_BUTTON} w-full justify-center sm:w-fit`}>
                    Login To Academics
                  </button>
                </form>
                {status ? <p className="mt-4 text-sm text-slate-600">{status}</p> : null}
              </div>
            </article>
          </section>
        ) : (
          <>
            <section className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/75 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.07)]">
              <div>
                <p className="text-[0.72rem] font-extrabold tracking-[0.16em] text-teal-700 uppercase">Authenticated Student</p>
                <h2 className="font-display mt-2 text-3xl font-semibold text-slate-950 max-md:text-2xl">Welcome, {student.name}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Roll Number: {student.rollNumber} | {student.className} | {student.stream}
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex rounded-full border border-slate-300/80 bg-white/88 px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-950 hover:text-white"
              >
                Logout
              </button>
            </section>
            <AcademicsSection institute={{ academic_content: academicData }} studentContext={student} />
            <CallToActionBanner
              title="Need help choosing the right stream after Class X?"
              description="The institute supports families with stream selection guidance, admission queries, and academic planning for the higher secondary stage."
              primaryAction={{ label: "Apply For Admission", href: "/admission" }}
              secondaryAction={{ label: "Talk To The School", href: "/about#contact" }}
            />
          </>
        )}
      </main>
    </div>
  );
}
