"use client";

import AdmissionSection from "../../components/home/AdmissionSection";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import PageHero from "../../components/common/PageHero";
import useInstituteData from "../../hooks/useInstituteData";
import { PAGE_MAIN } from "../../lib/uiClasses";

export default function AdmissionApplyPage() {
  const { institute, loading } = useInstituteData();
  const controls = institute?.site_controls;
  const admissionApplyEnabled = controls?.admission_apply_page_enabled ?? true;
  const admissionOpen = controls?.admission_open ?? true;

  return (
    <div className="min-h-screen">
      <main className={PAGE_MAIN}>
        {loading && !institute ? (
          <section className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3">
            <LoadingSpinner label="Loading institute data" />
          </section>
        ) : null}
        <PageHero
          eyebrow="Admissions"
          title="Admission Form"
          description="Fill the complete admission form and submit to generate your application ID and receipt."
          stats={[
            { value: "Step 1", label: "Fill Form" },
            { value: "Step 2", label: "Submit" },
            { value: "Step 3", label: "Track Status" },
          ]}
          actions={[{ label: "Back to Admissions", href: "/admission", variant: "secondary" }]}
        />

        {!admissionApplyEnabled ? (
          <section className="rounded-[2rem] border border-amber-300/70 bg-amber-50/90 p-6 text-amber-900 shadow-[0_18px_36px_rgba(217,119,6,0.12)]">
            <h1 className="text-xl font-extrabold">Admission Apply Page Disabled</h1>
            <p className="mt-2 text-sm">This page is currently turned off by the administrator.</p>
          </section>
        ) : !admissionOpen ? (
          <section className="rounded-[2rem] border border-amber-300/70 bg-amber-50/90 p-6 text-amber-900 shadow-[0_18px_36px_rgba(217,119,6,0.12)]">
            <h1 className="text-xl font-extrabold">Admissions Are Currently Closed</h1>
            <p className="mt-2 text-sm">The administrator has temporarily turned admissions off. Please check again later.</p>
          </section>
        ) : (
          <AdmissionSection institute={institute} initialOpen compact />
        )}
      </main>
    </div>
  );
}

