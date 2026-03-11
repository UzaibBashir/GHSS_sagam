"use client";

import { useState } from "react";
import { ADMISSION_CONTENT } from "../../lib/siteContent";

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
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] max-md:p-4">
        <h2 className="text-2xl font-extrabold text-slate-900 max-md:text-xl">Admission Guidelines</h2>
        <ul className="mt-3 grid list-disc gap-2 pl-5 text-slate-700">
          {ADMISSION_CONTENT.guidelines.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>

      <article className="rounded-2xl border border-teal-200 bg-teal-50 p-6 shadow-[0_10px_24px_rgba(13,148,136,0.12)] max-md:p-4">
        <h3 className="text-lg font-extrabold text-teal-900">Admission Helpdesk</h3>
        <p className="mt-2 inline-flex items-center gap-2 text-sm text-teal-900">
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>
          <span className="font-semibold">Mail:</span>
          <a className="font-bold underline" href="mailto:ghsssagam@gmail.com">
            ghsssagam@gmail.com
          </a>
        </p>
        <div className="mt-1 text-sm text-teal-900">
          <p className="inline-flex items-center gap-2">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.62a2 2 0 0 1-.45 2.11L8 9.99a16 16 0 0 0 6 6l1.54-1.23a2 2 0 0 1 2.11-.45c.84.29 1.72.5 2.62.62A2 2 0 0 1 22 16.92z" />
            </svg>
            <span className="font-semibold">Admission Incharge Contact:</span>
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 pl-6">
            <a className="font-bold underline" href="tel:+919622735195">
              +91 96227 35195
            </a>
            <span aria-hidden="true">|</span>
            <a className="font-bold underline" href="tel:+917006763600">
              +91 70067 63600
            </a>
          </div>
        </div>
      </article>

      <div className="grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] max-md:p-4">
          <h3 className="text-lg font-extrabold text-slate-900">Eligibility Requirements</h3>
          <ul className="mt-3 grid list-disc gap-2 pl-5 text-slate-700">
            {ADMISSION_CONTENT.eligibility.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] max-md:p-4">
          <h3 className="text-lg font-extrabold text-slate-900">Required Documents</h3>
          <ul className="mt-3 grid list-disc gap-2 pl-5 text-slate-700">
            {ADMISSION_CONTENT.requiredDocuments.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] max-md:p-4">
        <h3 className="text-lg font-extrabold text-slate-900">Online Admission Form</h3>
        <p className="mt-2 text-slate-700">
          Submit your application through our official Google Form. After submitting the form, return here to generate
          your provisional receipt.
        </p>
        <a
          href={formUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block rounded-full bg-teal-700 px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
        >
          Open Google Admission Form
        </a>

        <form onSubmit={generateReceipt} className="mt-6 grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-extrabold tracking-wide text-slate-800 uppercase">Generate Submission Receipt</h4>
          <input
            value={studentName}
            onChange={(event) => setStudentName(event.target.value)}
            placeholder="Student Full Name"
            className="rounded-lg border border-slate-300 px-3 py-2"
            required
          />
          <input
            type="email"
            value={studentEmail}
            onChange={(event) => setStudentEmail(event.target.value)}
            placeholder="Email Address"
            className="rounded-lg border border-slate-300 px-3 py-2"
            required
          />
          <input
            value={studentClass}
            onChange={(event) => setStudentClass(event.target.value)}
            placeholder="Applying For Class (e.g., XI Science)"
            className="rounded-lg border border-slate-300 px-3 py-2"
            required
          />
          <button
            type="submit"
            className="w-fit rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
          >
            Generate Receipt
          </button>
        </form>
      </article>

      {receipt ? (
        <article className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6 shadow-[0_10px_24px_rgba(16,185,129,0.15)] max-md:p-4">
          <h3 className="text-lg font-extrabold text-emerald-900">Provisional Admission Receipt</h3>
          <p className="mt-2 text-sm text-emerald-800">Receipt ID: {receipt.id}</p>
          <p className="text-sm text-emerald-800">Student Name: {receipt.name}</p>
          <p className="text-sm text-emerald-800">Email: {receipt.email}</p>
          <p className="text-sm text-emerald-800">Applied Class: {receipt.desiredClass}</p>
          <p className="text-sm text-emerald-800">Generated On: {receipt.generatedAt}</p>
          <p className="mt-3 text-xs text-emerald-900">
            This is a dummy provisional receipt. Replace this logic with final backend verification when your admission
            workflow is finalized.
          </p>
        </article>
      ) : null}
    </section>
  );
}

