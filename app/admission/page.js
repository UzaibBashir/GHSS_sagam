"use client";

import AdmissionOverviewSection from "../components/home/AdmissionOverviewSection";
import CallToActionBanner from "../components/common/CallToActionBanner";
import PageHero from "../components/common/PageHero";
import Navbar from "../components/layout/Navbar";
import useInstituteData from "../hooks/useInstituteData";
import { PAGE_MAIN } from "../lib/uiClasses";

export default function AdmissionPage() {
  const { institute } = useInstituteData();
  const controls = institute?.site_controls;
  const admissionPageEnabled = controls?.admission_page_enabled ?? true;
  const admissionOpen = controls?.admission_open ?? true;
  const eligibilityItems = Array.isArray(institute?.admission_content?.eligibility)
    ? institute.admission_content.eligibility
    : [];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className={PAGE_MAIN}>
        <PageHero
          eyebrow="Admissions"
          title="Begin your admission journey with clear guidance and stream-focused support"
          description="Families can review eligibility, required documents, and institutional guidance for admission into Medical, Non-Medical, and Arts streams at the higher secondary level."
          stats={[
            { value: "Medical", label: "Science With Biology" },
            { value: "Non-Medical", label: "Science With Mathematics" },
            { value: "Arts", label: "Humanities Pathway" },
            { value: "Support", label: "Front Desk Guidance" },
          ]}
          actions={[
            { label: "Contact For Help", href: "/contact" },
            { label: "View Academics", href: "/academics", variant: "secondary" },
          ]}
        />

        {!admissionPageEnabled ? (
          <section className="rounded-[2rem] border border-amber-300/70 bg-amber-50/90 p-6 text-amber-900 shadow-[0_18px_36px_rgba(217,119,6,0.12)]">
            <h1 className="text-xl font-extrabold">Admission Page Disabled</h1>
            <p className="mt-2 text-sm">This page is currently turned off by the administrator.</p>
          </section>
        ) : !admissionOpen ? (
          <section className="rounded-[2rem] border border-amber-300/70 bg-amber-50/90 p-6 text-amber-900 shadow-[0_18px_36px_rgba(217,119,6,0.12)]">
            <h1 className="text-xl font-extrabold">Admissions Are Currently Closed</h1>
            <p className="mt-2 text-sm">The administrator has temporarily turned admissions off. Please check again later.</p>
          </section>
        ) : (
          <>
            <AdmissionOverviewSection />

            <section className="glass-panel rounded-[2rem] border border-white/75 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] max-md:p-4">
              <p className="section-kicker">Eligibility</p>
              <h2 className="font-display mt-3 text-3xl font-semibold text-slate-950 max-md:text-2xl">
                Admission eligibility criteria
              </h2>
              <ul className="mt-4 grid gap-3">
                {eligibilityItems.map((item, index) => (
                  <li
                    key={`eligibility-${index}`}
                    className="rounded-[1.2rem] border border-slate-200/70 bg-white/82 px-4 py-3 text-sm leading-6 text-slate-700"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <CallToActionBanner
              title="Have questions about eligibility, documents, or stream placement?"
              description="Reach out to the school before submitting the form if you need support related to admissions, scholarships, or the most suitable stream for the student."
              primaryAction={{ label: "Contact The School", href: "/contact" }}
              secondaryAction={{ label: "Read About The Institute", href: "/about" }}
            />
          </>
        )}
      </main>
    </div>
  );
}
