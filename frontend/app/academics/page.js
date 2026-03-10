"use client";

import AcademicsSection from "../components/home/AcademicsSection";
import Navbar from "../components/layout/Navbar";
import useInstituteData from "../hooks/useInstituteData";
import { PAGE_MAIN } from "../lib/uiClasses";

export default function AcademicsPage() {
  const { institute } = useInstituteData();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className={PAGE_MAIN}>
        <AcademicsSection institute={institute} />
      </main>
    </div>
  );
}
