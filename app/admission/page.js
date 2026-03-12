"use client";

import AdmissionSection from "../components/home/AdmissionSection";
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
        {!admissionOpen ? (
          <section className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-amber-900">
            <h1 className="text-xl font-extrabold">Admissions Are Currently Closed</h1>
            <p className="mt-2 text-sm">The administrator has temporarily turned admissions off. Please check again later.</p>
          </section>
        ) : (
          <AdmissionSection institute={institute} />
        )}
      </main>
    </div>
  );
}