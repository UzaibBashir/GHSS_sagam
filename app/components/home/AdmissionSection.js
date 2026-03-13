"use client";

import { useState } from "react";
import { ADMISSION_CONTENT } from "../../lib/siteContent";
import { INPUT, PRIMARY_BUTTON } from "../../lib/uiClasses";

function ContactIcon({ type }) {
  const common = {
    className: "h-4 w-4",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  if (type === "email") {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.62a2 2 0 0 1-.45 2.11L8 9.99a16 16 0 0 0 6 6l1.54-1.23a2 2 0 0 1 2.11-.45c.84.29 1.72.5 2.62.62A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export default function AdmissionSection({ institute }) {
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [receipt, setReceipt] = useState(null);

  const formUrl = institute?.admission_form_url || ADMISSION_CONTENT.formUrl;

  const generateReceipt = (event) => {
    event.preventDefault();
    if (!studentName.trim() || !studentEmail.trim() || !studentClass.trim()) {
      return;
    }

    setReceipt({
      id: `GHHS-${Date.now().toString().slice(-8)}`,
      name: studentName.trim(),
      email: studentEmail.trim(),
      desiredClass: studentClass.trim(),
      generatedAt: new Date().toLocaleString(),
      formLink: formUrl,
    });
  };

  return (
    <section id="admission" className="grid gap-6">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-[2rem] border border-slate-200/80 bg-slate-950 p-6 text-white shadow-[0_20px_50px_rgba(15,23,42,0.14)] max-md:p-4">
          <p className="text-[0.72rem] font-extrabold tracking-[0.16em] text-amber-300 uppercase">Admission Journey</p>
          <h2 className="font-display mt-4 text-3xl font-semibold max-md:text-2xl">Start with clear guidance and complete documents</h2>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            Follow the process carefully, review stream eligibility, and keep all required documents ready before submitting the online form.
          </p>
          <ul className="mt-6 grid gap-3">
            {ADMISSION_CONTENT.guidelines.map((item, index) => (
              <li key={item} className="flex gap-3 rounded-[1.3rem] border border-white/12 bg-white/8 px-4 py-3 text-sm text-slate-100">
                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400 font-bold text-slate-950">
                  {index + 1}
                </span>
                <span className="leading-6">{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="glass-panel rounded-[2rem] border border-white/75 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] max-md:p-4">
          <p className="section-kicker">Admission Helpdesk</p>
          <h3 className="font-display mt-4 text-3xl font-semibold text-slate-950 max-md:text-2xl">Get direct support from the school</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Families can contact the admission desk for help with stream selection, form submission, and document preparation.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a href="mailto:ghsssagam@gmail.com" className="rounded-[1.4rem] bg-linear-to-br from-amber-100 to-yellow-50 p-4 text-amber-900 shadow-[0_14px_28px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5">
              <div className="inline-flex rounded-full bg-white/80 p-2 text-amber-700">
                <ContactIcon type="email" />
              </div>
              <p className="mt-3 text-[0.72rem] font-extrabold tracking-[0.16em] uppercase opacity-75">Email</p>
              <p className="mt-2 text-sm font-semibold">ghsssagam@gmail.com</p>
            </a>

            <div className="rounded-[1.4rem] bg-linear-to-br from-teal-100 to-cyan-50 p-4 text-teal-900 shadow-[0_14px_28px_rgba(15,23,42,0.06)]">
              <div className="inline-flex rounded-full bg-white/80 p-2 text-teal-700">
                <ContactIcon type="phone" />
              </div>
              <p className="mt-3 text-[0.72rem] font-extrabold tracking-[0.16em] uppercase opacity-75">Phone Support</p>
              <div className="mt-2 grid gap-1 text-sm font-semibold">
                <a href="tel:+919622735195" className="hover:underline">+91 96227 35195</a>
                <a href="tel:+917006763600" className="hover:underline">+91 70067 63600</a>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <article className="glass-panel rounded-[2rem] border border-white/75 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] max-md:p-4">
          <p className="section-kicker">Eligibility</p>
          <h3 className="font-display mt-4 text-2xl font-semibold text-slate-950">Who can apply</h3>
          <ul className="mt-4 grid gap-3">
            {ADMISSION_CONTENT.eligibility.map((item) => (
              <li key={item} className="rounded-[1.2rem] border border-slate-200/70 bg-white/82 px-4 py-3 text-sm leading-6 text-slate-700">
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="glass-panel rounded-[2rem] border border-white/75 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] max-md:p-4">
          <p className="section-kicker">Documents</p>
          <h3 className="font-display mt-4 text-2xl font-semibold text-slate-950">What to keep ready</h3>
          <ul className="mt-4 grid gap-3">
            {ADMISSION_CONTENT.requiredDocuments.map((item) => (
              <li key={item} className="rounded-[1.2rem] border border-slate-200/70 bg-white/82 px-4 py-3 text-sm leading-6 text-slate-700">
                {item}
              </li>
            ))}
          </ul>
        </article>
      </div>

      <article className="glass-panel rounded-[2rem] border border-white/75 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] max-md:p-4">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="section-kicker">Online Form</p>
            <h3 className="font-display mt-4 text-3xl font-semibold text-slate-950 max-md:text-2xl">Submit the official form and generate a provisional receipt</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Complete the admission form first, then return here to generate a provisional acknowledgement for your record.
            </p>
            <a
              href={formUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex rounded-full bg-linear-to-r from-amber-400 to-yellow-500 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-[0_16px_28px_rgba(212,166,70,0.26)] transition hover:-translate-y-0.5"
            >
              Open Google Admission Form
            </a>
          </div>

          <form onSubmit={generateReceipt} className="rounded-[1.7rem] border border-slate-200/80 bg-white/86 p-5 shadow-[0_14px_30px_rgba(15,23,42,0.05)]">
            <h4 className="text-[0.78rem] font-extrabold tracking-[0.16em] text-teal-700 uppercase">Generate Submission Receipt</h4>
            <div className="mt-4 grid gap-3">
              <input
                value={studentName}
                onChange={(event) => setStudentName(event.target.value)}
                placeholder="Student Full Name"
                className={INPUT}
                required
              />
              <input
                type="email"
                value={studentEmail}
                onChange={(event) => setStudentEmail(event.target.value)}
                placeholder="Email Address"
                className={INPUT}
                required
              />
              <input
                value={studentClass}
                onChange={(event) => setStudentClass(event.target.value)}
                placeholder="Applying For Class (for example XI Medical)"
                className={INPUT}
                required
              />
              <button type="submit" className={PRIMARY_BUTTON}>
                Generate Receipt
              </button>
            </div>
          </form>
        </div>
      </article>

      {receipt ? (
        <article className="rounded-[2rem] border border-emerald-300/80 bg-linear-to-br from-emerald-50 to-teal-50 p-6 shadow-[0_18px_36px_rgba(16,185,129,0.14)] max-md:p-4">
          <p className="text-[0.72rem] font-extrabold tracking-[0.16em] text-emerald-700 uppercase">Acknowledgement</p>
          <h3 className="font-display mt-3 text-3xl font-semibold text-emerald-950 max-md:text-2xl">Provisional Admission Receipt</h3>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-[1.2rem] border border-emerald-200/80 bg-white/80 px-4 py-3 text-sm text-emerald-900">
              <p className="font-bold">Receipt ID</p>
              <p className="mt-1">{receipt.id}</p>
            </div>
            <div className="rounded-[1.2rem] border border-emerald-200/80 bg-white/80 px-4 py-3 text-sm text-emerald-900">
              <p className="font-bold">Student Name</p>
              <p className="mt-1">{receipt.name}</p>
            </div>
            <div className="rounded-[1.2rem] border border-emerald-200/80 bg-white/80 px-4 py-3 text-sm text-emerald-900">
              <p className="font-bold">Email</p>
              <p className="mt-1">{receipt.email}</p>
            </div>
            <div className="rounded-[1.2rem] border border-emerald-200/80 bg-white/80 px-4 py-3 text-sm text-emerald-900">
              <p className="font-bold">Applied Class</p>
              <p className="mt-1">{receipt.desiredClass}</p>
            </div>
            <div className="rounded-[1.2rem] border border-emerald-200/80 bg-white/80 px-4 py-3 text-sm text-emerald-900 md:col-span-2 xl:col-span-2">
              <p className="font-bold">Generated On</p>
              <p className="mt-1">{receipt.generatedAt}</p>
            </div>
          </div>
          <p className="mt-4 text-xs leading-6 text-emerald-900">
            This is a demonstration receipt for the current webapp. Replace this with final backend verification when the admission workflow is finalized.
          </p>
        </article>
      ) : null}
    </section>
  );
}
