"use client";

import { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import PageHero from "../../components/common/PageHero";
import useInstituteData from "../../hooks/useInstituteData";
import { PAGE_MAIN } from "../../lib/uiClasses";
import { API_BASE } from "../../lib/api";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

export default function AdmissionStatusPage() {
  const { institute } = useInstituteData();
  const controls = institute?.site_controls;
  const admissionStatusEnabled = controls?.admission_status_page_enabled ?? true;

  const [applicationId, setApplicationId] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [statusData, setStatusData] = useState(null);
  const [error, setError] = useState("");

  const checkStatus = async (event) => {
    event.preventDefault();
    setError("");
    setStatusData(null);

    try {
      const params = new URLSearchParams({
        application_id: applicationId.trim(),
        name: name.trim(),
        dob: dob.trim(),
      });
      const res = await fetch(`${API_BASE}/admissions/status?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.detail || "Status lookup failed");
      }
      setStatusData(data);
    } catch (err) {
      setError(err.message || "Status lookup failed");
    }
  };

  const downloadReceipt = () => {
    if (!statusData) return;
    const receiptDate = new Date().toLocaleDateString();
    const html = `
      <html>
        <head>
          <title>Admission Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
            h1 { font-size: 20px; margin-bottom: 8px; }
            .meta { margin-bottom: 16px; font-size: 12px; color: #475569; }
            .card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 12px; }
            .label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; }
            .value { font-size: 14px; font-weight: 600; margin-top: 4px; }
          </style>
        </head>
        <body>
          <h1>Admission Receipt</h1>
          <div class="meta">Status: ${statusData.status.toUpperCase()}</div>
          <div class="card">
            <div class="label">Application ID</div>
            <div class="value">${statusData.application_id}</div>
          </div>
          <div class="card">
            <div class="label">Receipt Date</div>
            <div class="value">${receiptDate}</div>
          </div>
          <div class="card">
            <div class="label">Student Name</div>
            <div class="value">${statusData.name}</div>
          </div>
          <div class="card">
            <div class="label">Date of Birth</div>
            <div class="value">${statusData.dob}</div>
          </div>
          <div class="card">
            <div class="label">Submitted On</div>
            <div class="value">${formatDate(statusData.submitted_at)}</div>
          </div>
          <div class="card">
            <div class="label">Approved On</div>
            <div class="value">${formatDate(statusData.approved_at)}</div>
          </div>
          <div class="card">
            <div class="label">Remarks</div>
            <div class="value">${statusData.remarks || "None"}</div>
          </div>
          <script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); };</script>
        </body>
      </html>
    `;
    const win = window.open("", "_blank", "width=800,height=900");
    if (!win) return;
    win.document.open();
    win.document.write(html);
    win.document.close();
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className={PAGE_MAIN}>
        <PageHero
          eyebrow="Admissions"
          title="Check your admission status"
          description="Enter your application ID, name, and date of birth to view approval status and download your receipt once approved."
          stats={[
            { value: "Pending", label: "Verification" },
            { value: "Approved", label: "Receipt Ready" },
            { value: "Rejected", label: "See Remarks" },
          ]}
          actions={[{ label: "Back to Admission", href: "/admission", variant: "secondary" }]}
        />

        {!admissionStatusEnabled ? (
          <section className="rounded-[2rem] border border-amber-300/70 bg-amber-50/90 p-6 text-amber-900 shadow-[0_18px_36px_rgba(217,119,6,0.12)]">
            <h1 className="text-xl font-extrabold">Admission Status Page Disabled</h1>
            <p className="mt-2 text-sm">This page is currently turned off by the administrator.</p>
          </section>
        ) : (
          <>
            <section className="glass-panel rounded-[2rem] border border-white/75 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] max-md:p-4">
              <form onSubmit={checkStatus} className="grid gap-3 md:grid-cols-3">
                <input
                  value={applicationId}
                  onChange={(event) => setApplicationId(event.target.value)}
                  placeholder="Application ID"
                  className="rounded-2xl border border-slate-300/80 bg-white/88 px-4 py-3 text-sm shadow-[0_10px_18px_rgba(15,23,42,0.04)] outline-none"
                  required
                />
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Student Name"
                  className="rounded-2xl border border-slate-300/80 bg-white/88 px-4 py-3 text-sm shadow-[0_10px_18px_rgba(15,23,42,0.04)] outline-none"
                  required
                />
                <input
                  value={dob}
                  onChange={(event) => setDob(event.target.value)}
                  placeholder="Date of Birth (YYYY-MM-DD)"
                  className="rounded-2xl border border-slate-300/80 bg-white/88 px-4 py-3 text-sm shadow-[0_10px_18px_rgba(15,23,42,0.04)] outline-none"
                  required
                />
                <button
                  type="submit"
                  className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_28px_rgba(15,23,42,0.18)] md:col-span-3"
                >
                  Check Status
                </button>
              </form>
              {error ? <p className="mt-3 text-sm text-rose-700">{error}</p> : null}
            </section>

            {statusData ? (
              <section className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_18px_36px_rgba(15,23,42,0.1)] max-md:p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-extrabold tracking-[0.16em] text-slate-500 uppercase">Application Status</p>
                    <h2 className="font-display mt-2 text-2xl font-semibold text-slate-950">
                      {statusData.status === "approved" ? "Approved" : statusData.status === "rejected" ? "Rejected" : "Verification Pending"}
                    </h2>
                  </div>
                  {statusData.status === "approved" ? (
                    <button
                      type="button"
                      onClick={downloadReceipt}
                      className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white"
                    >
                      Download Receipt (PDF)
                    </button>
                  ) : null}
                </div>

                {statusData.status === "approved" ? (
                  <p className="mt-3 text-xs text-slate-500">Receipt is generated in your browser and not stored on the server.</p>
                ) : null}

                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  <div className="rounded-[1.2rem] border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-900">
                    <p className="font-bold">Application ID</p>
                    <p className="mt-1">{statusData.application_id}</p>
                  </div>
                  <div className="rounded-[1.2rem] border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-900">
                    <p className="font-bold">Student Name</p>
                    <p className="mt-1">{statusData.name}</p>
                  </div>
                  <div className="rounded-[1.2rem] border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-900">
                    <p className="font-bold">Date of Birth</p>
                    <p className="mt-1">{statusData.dob}</p>
                  </div>
                  <div className="rounded-[1.2rem] border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-900">
                    <p className="font-bold">Submitted On</p>
                    <p className="mt-1">{formatDate(statusData.submitted_at)}</p>
                  </div>
                  <div className="rounded-[1.2rem] border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-900">
                    <p className="font-bold">Approved On</p>
                    <p className="mt-1">{formatDate(statusData.approved_at)}</p>
                  </div>
                  <div className="rounded-[1.2rem] border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-900 md:col-span-2 xl:col-span-3">
                    <p className="font-bold">Remarks</p>
                    <p className="mt-1">{statusData.remarks || "No remarks yet."}</p>
                  </div>
                </div>

                {statusData.status !== "approved" ? (
                  <p className="mt-4 text-sm text-slate-600">Receipt will be available after admin approval.</p>
                ) : null}
              </section>
            ) : null}
          </>
        )}
      </main>
    </div>
  );
}
