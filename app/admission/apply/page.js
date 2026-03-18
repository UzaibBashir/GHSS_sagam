"use client";

import AdmissionSection from "../../components/home/AdmissionSection";
import Navbar from "../../components/layout/Navbar";
import PageHero from "../../components/common/PageHero";
import useInstituteData from "../../hooks/useInstituteData";
import { PAGE_MAIN } from "../../lib/uiClasses";

export default function AdmissionApplyPage() {
  const { institute } = useInstituteData();
  const controls = institute?.site_controls;
  const admissionOpen = controls?.admission_open ?? true;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className={PAGE_MAIN}>
        <PageHero
          eyebrow="Admissions"
          title="Dedicated admission form"
          description="Fill the complete admission form and submit to generate your application ID and automatic receipt."
          stats={[
            { value: "Step 1", label: "Fill Form" },
            { value: "Step 2", label: "Submit" },
            { value: "Step 3", label: "Track Status" },
          ]}
          actions={[{ label: "Back to Admissions", href: "/admission", variant: "secondary" }]}
        />

        {!admissionOpen ? (
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
