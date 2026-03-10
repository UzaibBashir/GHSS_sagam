"use client";

import DownloadsSection from "../components/home/DownloadsSection";
import Navbar from "../components/layout/Navbar";
import useInstituteData from "../hooks/useInstituteData";
import { PAGE_MAIN } from "../lib/uiClasses";

export default function DownloadPage() {
  const { institute } = useInstituteData();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className={PAGE_MAIN}>
        <DownloadsSection institute={institute} />
      </main>
    </div>
  );
}
