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
  const admissionOpen = controls?.admission_open ?? true;

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

        {!admissionOpen ? (
          <section className="rounded-[2rem] border border-amber-300/70 bg-amber-50/90 p-6 text-amber-900 shadow-[0_18px_36px_rgba(217,119,6,0.12)]">
            <h1 className="text-xl font-extrabold">Admissions Are Currently Closed</h1>
            <p className="mt-2 text-sm">The administrator has temporarily turned admissions off. Please check again later.</p>
          </section>
        ) : (
          <>
            <AdmissionOverviewSection />
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
