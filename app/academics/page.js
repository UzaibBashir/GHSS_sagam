"use client";

import AcademicsSection from "../components/home/AcademicsSection";
import Navbar from "../components/layout/Navbar";
import useInstituteData from "../hooks/useInstituteData";
import { PAGE_MAIN } from "../lib/uiClasses";

export default function AcademicsPage() {
  const { institute } = useInstituteData();
  const controls = institute?.site_controls;
  const academicsEnabled = controls?.academics_page_enabled ?? true;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className={PAGE_MAIN}>
        {!academicsEnabled ? (
          <section className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-amber-900">
            <h1 className="text-xl font-extrabold">Academics Page Disabled</h1>
            <p className="mt-2 text-sm">This page is currently disabled by the administrator.</p>
          </section>
        ) : (
          <AcademicsSection institute={institute} />
        )}
      </main>
    </div>
  );
}