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