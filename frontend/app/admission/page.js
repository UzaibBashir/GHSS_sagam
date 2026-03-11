"use client";

import AdmissionSection from "../components/home/AdmissionSection";
import Navbar from "../components/layout/Navbar";
import useInstituteData from "../hooks/useInstituteData";
import { PAGE_MAIN } from "../lib/uiClasses";

export default function AdmissionPage() {
  const { institute } = useInstituteData();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className={PAGE_MAIN}>
        <AdmissionSection institute={institute} />
      </main>
    </div>
  );
}