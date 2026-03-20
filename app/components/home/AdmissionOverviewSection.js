"use client";

import Link from "next/link";

export default function AdmissionOverviewSection() {
  return (
    <section className="grid gap-6">
      <article className="glass-panel rounded-[2rem] border border-white/75 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] max-md:p-4">
        <p className="section-kicker">Admissions</p>
        <h2 className="font-display mt-3 text-3xl font-semibold text-slate-950 max-md:text-2xl">
          Open the dedicated admission form page
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Click Apply Now to open the full admission form page. Use the dedicated status page to track your application.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/admission/apply"
            className="inline-flex rounded-full bg-linear-to-r from-amber-400 to-yellow-500 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-[0_16px_28px_rgba(212,166,70,0.26)] transition hover:-translate-y-0.5"
          >
            Apply Now
          </Link>
          <Link
            href="/admission/status"
            className="inline-flex rounded-full border border-slate-300/80 bg-white/90 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Check Admission Status
          </Link>
        </div>
      </article>
    </section>
  );
}
